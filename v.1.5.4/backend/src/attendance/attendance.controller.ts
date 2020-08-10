import {
  Controller,
  HttpException,
  NotFoundException,
  UseGuards,
  Req,
  Request,
  Delete,
  Body,
} from '@nestjs/common';
import { Attendance } from './attendance.entity';
import { AttendanceService } from './attendance.service';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/role/roles.guard';
import { EmployeeService } from '../employee/employee.service';
import { CreateAttendanceDto, CreateManyAttendanceDto } from './attendance.dto';
import { getAccountId } from '../utils/auth';
import { DeleteManyDto } from './delete.dto';

@Crud({
  model: {
    type: Attendance,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  query: {
    join: {
      // tslint:disable-next-line: object-literal-key-quotes
      employee: {
        exclude: [],
      },
      'employee.group': {
        exclude: [],
      },
      'employee.department': {
        exclude: [],
      },
      'employee.department.groups': {
        exclude: [],
      },
      'employee.area': {
        exclude: [],
      },
      'employee.position': {
        exclude: [],
      },
    },
  },
})
@ApiUseTags('Attendances')
@Controller('attendances')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class AttendanceController implements CrudController<Attendance> {
  constructor(
    public service: AttendanceService,
    private readonly employeeService: EmployeeService,
  ) {}

  get base(): CrudController<Attendance> {
    return this;
  }

  // @Roles('admin', 'hr')
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateAttendanceDto,
  ) {
    try {
      if (!dto.employee_id && !dto.employee_nik) {
        throw new HttpException(
          'Please provide employee_id or employee_nik',
          400,
        );
      }
      const currentAttendance = await this.service.checkForDuplicate(dto);
      if (currentAttendance && currentAttendance.length > 0){
        throw new HttpException('Duplicate entry detected', 409);
      }
      let newDto: any = dto;
      if (dto.employee_nik) {
        const employees = await this.employeeService.findByNiks([
          dto.employee_nik,
        ]);
        if (employees.length === 0) {
          throw new NotFoundException('Employee is not found');
        }
        newDto = {
          ...dto,
          employee_id: employees[0],
        };
        delete newDto.employee_nik;
      }
      return await this.base.createOneBase(req, newDto);
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }

  @Override()
  async createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyAttendanceDto,
  ) {
    try {
      const listDataWithNik = await dto.bulk.filter(
        (item: any) => item.employee_nik,
      );
      const listNik = await listDataWithNik.map(
        (item: any) => item.employee_nik,
      );
      const listDataWithId = await dto.bulk.filter(
        (item: any) => item.employee_id,
      );
      const listId = await listDataWithId.map((item: any) => item.employee_id);
      let listEmployeesByNik = [];
      if (listNik.length > 0) {
        listEmployeesByNik = await this.employeeService.findByNiks(listNik);
      }
      let listEmployeesById = [];
      if (listId.length > 0) {
        listEmployeesById = await this.employeeService.findByIds(listId);
      }
      const timeList = await this.service.find({
        select: [
          'employee_id',
          'time_check_in',
          'time_check_out_for_break',
          'time_check_in_for_break',
          'time_check_out',
        ],
      });
      const newDto: any = {
        bulk: [],
      };
      for (const index in dto.bulk) {
        if (dto.bulk[index]) {
          const data: any = dto.bulk[index];
          if (!data.employee_id && !data.employee_nik) {
            throw new HttpException(
              `Please provide employee_id or employee_nik (row: ${index + 1})`,
              400,
            );
          } else if (data.employee_nik) {
            const currentAttendance = await this.service.checkForDuplicate(
              data,
            );
            if (currentAttendance && currentAttendance.length > 0) {
              throw new HttpException('Duplicate entry detected', 409);
            }
            const findEmployee = await listEmployeesByNik.find(
              item => item.nik.toString() === data.employee_nik.toString(),
            );
            if (findEmployee) {
              const newData = {
                ...data,
                employee_id: findEmployee.id,
              };
              const validate = timeList.find((item: any) => {
                return (
                  item.employee_id === newData.employee_id &&
                  item.time_check_in.toLocaleString() ===
                    new Date(data.time_check_in).toLocaleString() &&
                  item.time_check_out_for_break.toLocaleString() ===
                    new Date(data.time_check_out_for_break).toLocaleString() &&
                  item.time_check_in_for_break.toLocaleString() ===
                    new Date(data.time_check_in_for_break).toLocaleString() &&
                  item.time_check_out.toLocaleString() ===
                    new Date(data.time_check_out).toLocaleString()
                );
              });
              if (validate) {
                throw new HttpException(
                  `Duplicate datetime on NIK ${data.employee_nik}, row: ${index})`,
                  409,
                );
              } else {
                delete newData.employee_nik;
                newDto.bulk.push(newData);
              }
            } else {
              throw new HttpException(
                `Employee is not found (NIK: ${data.employee_nik}, row: ${index})`,
                404,
              );
            }
          } else {
            const findEmployee = await listEmployeesByNik.find(
              item => item.nik === data.employee_nik,
            );
            if (findEmployee) {
              const newData = {
                ...data,
              };
              const validate = timeList.find((item: any) => {
                return (
                  item.employee_id === newData.employee_id &&
                  item.time_check_in.toLocaleString() ===
                    new Date(data.time_check_in).toLocaleString() &&
                  item.time_check_out_for_break.toLocaleString() ===
                    new Date(data.time_check_out_for_break).toLocaleString() &&
                  item.time_check_in_for_break.toLocaleString() ===
                    new Date(data.time_check_in_for_break).toLocaleString() &&
                  item.time_check_out.toLocaleString() ===
                    new Date(data.time_check_out).toLocaleString()
                );
              });
              if (validate) {
                throw new HttpException(
                  `Duplicate datetime on NIK ${data.employee_nik}, row: ${index})`,
                  400,
                );
              } else {
                delete newData.employee_nik;
                newDto.bulk.push(newData);
              }
            } else {
              throw new HttpException(
                `Employee is not found (ID: ${data.employee_id}, row: ${index})`,
                404,
              );
            }
          }
        }
      }
      const xx = newDto.bulk.filter((item: any) => !item.meta);
      return await this.base.createManyBase(req, newDto);
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }

  @Override()
  async updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Attendance, @Req() request: Request) {
    const accountId = await getAccountId((request.headers as any).authorization);
    return await this.service.customUpdateOne(req, dto, {accountId});
  }

  @Override()
  async replaceOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Attendance, @Req() request: Request) {
    const accountId = await getAccountId((request.headers as any).authorization);
    return await this.service.customReplaceOne(req, dto, {accountId});
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest, @Req() request: Request) {
    const accountId = await getAccountId((request.headers as any).authorization);
    return await this.service.customDeleteOne(req, {accountId});
  }

  @Delete('custom/bulk')
  async deleteMany(@Body() dto: DeleteManyDto, @Req() request: Request) {
    const accountId = await getAccountId((request.headers as any).authorization);
    // const stringQuery = 'sort=time_check_in%2CDESC&join=employee&join=employee.department&join=employee.department.groups&join=employee.group&join=employee.area&join=employee.position&filter[]=employee.department_id%7C%7Ceq%7C%7C64375fa2-7956-42b0-80b1-d0af262b36bd&filter[]=employee.group_id%7C%7Ceq%7C%7Ccb60ea51-97fd-4426-b2e6-3405ac4b5b3c&filter[]=employee.area_id%7C%7Ceq%7C%7C9feb0244-a949-429a-96e4-70fd8c22b33d&filter[]=employee.position_id%7C%7Ceq%7C%7Cb89303b6-5c37-484a-bb3a-bb6d2b520e5f&filter[]=time_check_in%7C%7Cgt%7C%7C2019-12-05 00:00:00&filter[]=time_check_out%7C%7Clt%7C%7C2019-12-18 07:00:00&filter[]=employee.name%7C%7Ccont%7C%7Cadit&per_page=10&page=1&cache=0';
    // dto = {
    //   ...dto,
    //   query: stringQuery,
    //   ids: [],
    //   isAllSelected: true,
    // };
    return await this.service.deleteMany(dto);
  }
}
