import { Injectable, HttpException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Leave } from './leave.entity';
import { createQueryBuilder } from 'typeorm';
import { Attendance } from '../attendance/attendance.entity';
import { DeleteManyLeaveDto } from './leave.dto';
import { convertQuery } from '../utils/queryTransformer';

@Injectable()
export class LeaveService extends TypeOrmCrudService<Leave> {
  constructor(@InjectRepository(Leave) repo) {
    super(repo);
  }
  async checkForDuplicate(dto: Leave) {
    try {
      const queryBuilder: any = await this.repo
        .createQueryBuilder('leaves')
        .where('employee_id = :employee_id', { ...dto })
        .andWhere(
          `(IF(CONVERT_TZ(:date_start,'+00:00','+07:00') >= date_start AND CONVERT_TZ(:date_start,'+00:00','+07:00') <= date_end,'TRUE','FALSE')='TRUE'
      OR IF(CONVERT_TZ(:date_end,'+00:00','+07:00') >= date_start AND CONVERT_TZ(:date_end,'+00:00','+07:00') <= date_end,'TRUE','FALSE')='TRUE'
      OR IF(CONVERT_TZ(:date_start,'+00:00','+07:00') <= date_start AND CONVERT_TZ(:date_end,'+00:00','+07:00') >= date_end,'TRUE','FALSE')='TRUE')`,
          { ...dto },
        );

      return await queryBuilder.getCount();
    } catch (e) {
      return Promise.reject(e);
    }
  }
  // TODO: validate in attendance data before insert
  async validateAttendance(dto: Leave) {
    try {
      const queryBuilder: any = await createQueryBuilder()
        .select('attendances')
        .from(Attendance, 'attendance')
        .where('attendance.employee_id = :employee_id', { ...dto })
        .andWhere(
          'attendance.time_check_in >= :date_start AND attendance.time_check_out <= :date_end',
          { ...dto },
        );
      return await queryBuilder.getCount();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteMany(dto: DeleteManyLeaveDto): Promise<any> {
    try {
      if (dto.isAllSelected) {
        const queries = await convertQuery(dto.query);
        let queryBuilder: any = await this.repo.createQueryBuilder('leave');
        queryBuilder = await queryBuilder.leftJoinAndSelect(
          'leave.employee',
          'employee',
        );
        queryBuilder = await queryBuilder.select('leave.id');
        if (queries) {
          for (const filter of queries.filters) {
            queryBuilder = await queryBuilder.andWhere(
              `${filter.field} ${filter.operator} ${JSON.stringify(
                filter.value,
              )}`,
            );
          }
        } else {
          throw new HttpException('Query not valid: ', 400);
        }
        const res = await queryBuilder.getMany();
        if (res.length === 0) {
          throw new HttpException('Not found', 404);
        } else {
          const ids = await res.map(item => item.id);
          return await this.repo.delete(ids);
        }
      } else {
        return await this.repo.delete(dto.ids);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
