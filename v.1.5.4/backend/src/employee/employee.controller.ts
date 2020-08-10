import {
  Controller,
  HttpException,
  UseGuards,
  Req,
  Put,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
} from '@nestjsx/crud';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/role/roles.guard';
import { DepartmentService } from '../department/department.service';
import { getBranchId, getAccountId } from '../utils/auth';
import { GetEmployeeDataForPayslipDto } from './employee.dto';
import mysqldump from 'mysqldump';

@Crud({
  model: {
    type: Employee,
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
      group: {
        exclude: [],
      },
      department: {
        exclude: [],
      },
      area: {
        exclude: [],
      },
      position: {
        exclude: [],
      },
      attendances: {
        exclude: [],
      },
      leaves: {
        exclude: [],
      },
      loans: {
        exclude: [],
      },
    },
  },
})
@ApiUseTags('Employees')
@Controller('employees')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class EmployeeController implements CrudController<Employee> {
  constructor(
    public service: EmployeeService,
    private readonly departmentService: DepartmentService,
  ) { }

  get base(): CrudController<Employee> {
    return this;
  }

  @Override()
  getMany(@ParsedRequest() req: CrudRequest, @Req() request: Request) {
    try {
      const branchId = getBranchId((request.headers as any).authorization);
      if (branchId) {
        const newReq: any = {
          field: 'department.branch_id',
          operator: 'eq',
          value: branchId,
        };
        req.parsed.filter.push(newReq);
        if (!req.parsed.join.find(item => item.field === 'department')) {
          req.parsed.join.push({ field: 'department' });
        }
        return this.service.customGetMany(req);
      } else {
        return this.service.customGetMany(req);
      }
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }

  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    try {
      return this.service.customGetOne(req);
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }

  @Override()
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Employee) {
    try {
      return this.base.createOneBase(req, dto);
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
    @ParsedBody() dto: CreateManyDto<Employee>,
  ) {
    try {
      const listDataWithDepartment = await dto.bulk.filter(
        (item: any) => item.department,
      );
      const listDepartment = await listDataWithDepartment.map(
        (item: any) => item.department,
      );

      let listDepartmentByName = [];
      if (listDepartment.length > 0) {
        listDepartmentByName = await this.departmentService.findByNames(
          listDepartment,
        );
      }
      const newDto: any = {
        bulk: [],
      };
      let failDto: any = [];
      newDto.bulk = dto.bulk.map((el: any) => {
        const findDepartment: any = listDepartmentByName.find((a: any) => {
          return el.department === a.name;
        });
        let findGroup: any = {};
        let dataShift: any = [];
        let findPosition: any = {};
        let findArea: any = {};
        if (findDepartment) {
          findGroup = findDepartment.groups.find((b: any) => {
            return el.group === b.name;
          });
          findArea = findDepartment.areas.find((c: any) => {
            return el.area === c.name;
          });
        }
        if (
          findGroup &&
          findGroup.schedule &&
          findGroup.schedule.schedules[0].flexible_break === true
        ) {
          const shift: any = findDepartment.groups.map((data: any) => {
            delete data.base_salary;
            delete data.created_at;
            delete data.day_salary;
            delete data.updated_at;
            delete data.week_salary;
            return data;
          });
          dataShift = shift;
        }
        if (findArea && findDepartment) {
          findPosition = findArea.positions.find((d: any) => {
            return el.skill === d.name;
          });
        }
        if (dataShift.length > 0) {
          return {
            ...el,
            department_id: findDepartment ? findDepartment.id : null,
            group_id: findGroup ? findGroup.id : null,
            area_id: findArea ? findArea.id : null,
            position_id: findPosition ? findPosition.id : null,
            meta: {
              ...el.meta,
              schedule_shift: dataShift,
            },
          };
        } else {
          return {
            ...el,
            department_id: findDepartment ? findDepartment.id : null,
            group_id: findGroup ? findGroup.id : null,
            area_id: findArea ? findArea.id : null,
            position_id: findPosition ? findPosition.id : null,
          };
        }
      });
      failDto = newDto.bulk.filter(
        (item: any) =>
          !item.department_id ||
          !item.group_id ||
          !item.area_id ||
          !item.position_id,
      );
      const listNIK: any = await newDto.bulk.map((el: any) => el.nik);
      const find: any = await this.service.findByNiks(listNIK);
      if (failDto.length > 0) {
        throw new HttpException(failDto, 406);
      } else if (find.length > 0) {
        const newDuplicate: any = newDto.bulk.map((el: any) => {
          const findIds: any = find.find((item: any) => {
            return el.nik === item.nik;
          });
          if (findIds) {
            el = {
              ...el,
              duplicate: true,
            };
          }
          return el;
        });
        throw new HttpException(newDuplicate, 409);
      } else {
        return this.base.createManyBase(req, newDto);
      }
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 409,
      );
    }
  }

  @Override()
  updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Employee,
    @Req() request: Request,
  ) {
    try {
      const accountId = getAccountId((request.headers as any).authorization);
      return this.service.customUpdateOne(req, dto, { accountId });
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }

  @Override()
  replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Employee,
    @Req() request: Request,
  ) {
    try {
      const accountId = getAccountId((request.headers as any).authorization);
      return this.service.customReplaceOne(req, dto, { accountId });
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }

  @Override()
  deleteOne(@ParsedRequest() req: CrudRequest, @Req() request: Request) {
    try {
      const accountId = getAccountId((request.headers as any).authorization);
      return this.service.customDeleteOne(req, { accountId });
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }
  @Get('custom/getBirthday')
  getBirthday() {
    try {
      return this.service.getEmployeeBirthday();
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }

  @Get('custom/getTotalEmployee')
  getTotalEmployee() {
    try {
      return this.service.getTotalEmployee();
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }

  @Put('custom/switchGroup')
  switchGroup(@Req() request: Request) {
    try {
      const accountId = getAccountId((request.headers as any).authorization);
      return this.service.switchGroup({ accountId });
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }

  @Get('custom/getEmployeeDataForPayslip')
  getEmployeeDataForPayslip(@Query() query: GetEmployeeDataForPayslipDto) {
    try {
      return this.service.getEmployeeDataForPayslip(query);
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }
  @Get('/custom/backup')
  getDbBackup(@Req() request: Request){
    try {
      const accountId = getAccountId((request.headers as any).authorization);
      if (accountId) {
        const dump: any = mysqldump({
          connection: {
            host: process.env.TYPEORM_HOST,
            user: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
          },
          // dumpToFile: '../frontend/public/files/MJA_DB_BACKUP_' + (new Date().getTime()) + '.sql',
        });
        return dump;
      }
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500,
      );
    }
  }
}
