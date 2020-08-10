import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { CrudRequest } from '@nestjsx/crud';
import { ENTITIES } from '../utils/constants';
import { LogService } from '../log/log.service';
import { LOG_GROUP_EXCLUDE } from '../log/log.constants';
import _ from 'lodash';
import { DeleteManyDto } from './delete.dto';
import { convertQuery } from '../utils/queryTransformer';

@Injectable()
export class AttendanceService extends TypeOrmCrudService<Attendance> {
  constructor(
    @InjectRepository(Attendance) repo,
    private readonly logService: LogService,
  ) {
    super(repo);
  }
  async checkForDuplicate(dto: any): Promise<Attendance[]> {
    try {
      const res = await this.repo
        .createQueryBuilder('attendances')
        .select(['time_check_in', 'employee_id'])
        .where(
          'DAY(time_check_in) = :day AND MONTH(time_check_in) = :month AND YEAR(time_check_in) = :year AND employee_id = :employee_id',
          {
            day: new Date(dto.time_check_in).getDate(),
            month: new Date(dto.time_check_in).getMonth() + 1,
            year: new Date(dto.time_check_in).getFullYear(),
            employee_id: dto.employee_id,
          },
        );
      const result = res.execute();
      if (result) {
        return result;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async customUpdateOne(
    req: CrudRequest,
    dto: Attendance,
    additionalData: any,
  ): Promise<Attendance> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData = await super.findOne(filterId.value);
    const res: Attendance = await super.updateOne(req, dto);
    const newData = await super.findOne(filterId.value);

    const changeDetail = await this.getChangeDetail(oldData, newData);

    if (changeDetail.isAnyChange) {
      await this.logService.create({
        entity: ENTITIES.attendance,
        action: 'UPDATE',
        account_id: additionalData.accountId,
        meta: {
          previous_data: changeDetail.oldData,
          current_data: changeDetail.newData,
        },
      });
    }
    return res;
  }

  async customReplaceOne(
    req: CrudRequest,
    dto: Attendance,
    additionalData: any,
  ): Promise<Attendance> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData = await super.findOne(filterId.value);
    const res: Attendance = await super.replaceOne(req, dto);
    const newData = await super.findOne(filterId.value);

    const changeDetail = await this.getChangeDetail(oldData, newData);

    if (changeDetail.isAnyChange) {
      await this.logService.create({
        entity: ENTITIES.attendance,
        action: 'UPDATE',
        account_id: additionalData.accountId,
        meta: {
          previous_data: changeDetail.oldData,
          current_data: changeDetail.newData,
        },
      });
    }
    return res;
  }

  async customDeleteOne(req: CrudRequest, additionalData: any): Promise<any> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData = await super.findOne(filterId.value);
    const res: any = await super.deleteOne(req);
    await this.logService.create({
      entity: ENTITIES.attendance,
      action: 'DELETE',
      account_id: additionalData.accountId,
      meta: {
        previous_data: oldData,
        current_data: null,
      },
    });
    return res;
  }

  async getChangeDetail(oldData: any, newData: any): Promise<any> {
    let isAnyChange: boolean = false;
    if (oldData.meta && newData.meta) {
      const oldKeys = await Object.keys(oldData.meta);
      const newKeys = await Object.keys(newData.meta);
      const keys = oldKeys.concat(newKeys);
      const trackedKeys = [];
      const excludes = LOG_GROUP_EXCLUDE;
      for (const key of keys) {
        if (trackedKeys.includes(key)) {
          // do nothing, because this key been tracked
        } else {
          if (excludes.includes(key)) {
            // do nothing
          } else if (oldData.meta[key] !== newData.meta[key]) {
            isAnyChange = true;
          } else {
            // do nothing
          }
          trackedKeys.push(key);
        }
      }
    }

    return {
      isAnyChange,
      oldData,
      newData,
    };
  }

  async deleteMany(dto: DeleteManyDto): Promise<any> {
    try {
      if (dto.isAllSelected) {
        const queries = await convertQuery(dto.query);
        let queryBuilder: any = await this.repo.createQueryBuilder('attendance');
        queryBuilder = await queryBuilder.leftJoinAndSelect('attendance.employee', 'employee');
        queryBuilder = await queryBuilder.select('attendance.id');
        if (queries) {
          for (const filter of queries.filters) {
            queryBuilder = await queryBuilder.andWhere(`${filter.field} ${filter.operator} ${JSON.stringify(filter.value)}`);
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
