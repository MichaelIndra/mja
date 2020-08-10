import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { Department } from '../department.entity';
import { In } from 'typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { ENTITIES } from '../../utils/constants';
import { LogService } from '../../log/log.service';

@Injectable()
export class GroupService extends TypeOrmCrudService<Group> {
  constructor(
    @InjectRepository(Group) repo,
    private readonly logService: LogService,
  ) {
    super(repo);
  }
  async findByName(names: string[]): Promise<Group[]> {
    try {
      if (names.length === 0) {
        return Promise.reject({
          statusCode: 400,
          message: 'Group name must be an array of string',
        });
      }
      const res = await this.repo.find({
        where: { name: In(names) },
      });
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async customUpdateOne(
    req: CrudRequest,
    dto: Group,
    additionalData: any,
  ): Promise<Group> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData = await super.findOne(filterId.value);
    const res: Group = await super.updateOne(req, dto);
    const newData = await super.findOne(filterId.value);

    const changeDetail = await this.getChangeDetail(oldData, newData);
    if (changeDetail.isAnyChange) {
      await this.logService.create({
        entity: ENTITIES.group,
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
    dto: Group,
    additionalData: any,
  ): Promise<Group> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    const oldData = await super.findOne(filterId.value);
    const res: Group = await super.replaceOne(req, dto);
    const newData = await super.findOne(filterId.value);
    const changeDetail = await this.getChangeDetail(oldData, newData);
    if (changeDetail.isAnyChange) {
      await this.logService.create({
        entity: ENTITIES.group,
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
      entity: ENTITIES.employee,
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
    if (oldData.base_salary !== newData.base_salary) {
      isAnyChange = true;
    }

    return {
      isAnyChange,
      oldData,
      newData,
    };
  }

  async getListSwitchable() {
    try {
      return await this.repo.createQueryBuilder('group')
      .leftJoinAndSelect('group.department', 'department')
      .where('group.switchable = 1').orderBy('group.department_id', 'ASC').addOrderBy('group.name', 'ASC').getMany();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
