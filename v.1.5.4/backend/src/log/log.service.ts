import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { CrudRequest } from '@nestjsx/crud';
import { Repository } from 'typeorm';
import { Department } from '../department/department.entity';
import { Group } from '../department/group/group.entity';
import { Area } from '../department/area/area.entity';
import { Position } from '../department/area/position/position.entity';
import { ENTITIES } from '../utils/constants';
import { LOG_GROUP_EXCLUDE } from './log.constants';

@Injectable()
export class LogService extends TypeOrmCrudService<Log> {
  constructor(
    @InjectRepository(Log) repo,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {
    super(repo);
  }

  async create(dto: Partial<Log>): Promise<Log> {
    const created = await this.repo.create(dto);
    return await this.repo.save(created);
  }

  async getMany(req: CrudRequest): Promise<any> {
    let res = await super.getMany(req);
    res = await this.getChangeDetails(res);
    return res;
  }

  async getOne(req: CrudRequest): Promise<any> {
    let res = await super.getOne(req);
    res = await this.getChangeDetail(res);
    return res;
  }

  async getChangeDetails(res: any): Promise<any> {
    let datas;
    if (res.data) {
      datas = res.data;
    } else {
      datas = res;
    }
    for (const index in datas) {
      if (datas[index]) {
        datas[index] = await this.getChangeDetail(datas[index]);
      }
    }
    if (res.data) {
      res.data = datas;
    } else {
      res = datas;
    }

    return res;
  }

  async getChangeDetail(res: any): Promise<any> {
    const listChange: string[] = [];
    let oldData = res.meta.previous_data;
    let newData = res.meta.current_data;

    if (res.action === 'UPDATE') { // ------------------ UPDATE ------------------------
      if (res.entity === ENTITIES.employee) {
        if (
          oldData.department_id !==
          newData.department_id
        ) {
          let department = await this.departmentRepository.findOne(
            oldData.department_id,
          );
          oldData = {
            ...oldData,
            department,
          };

          department = await this.departmentRepository.findOne(
            newData.department_id,
          );
          newData = {
            ...newData,
            department,
          };

          listChange.push('department_id');
        }

        if (oldData.group_id !== newData.group_id) {
          let group = await this.groupRepository.findOne(
            oldData.group_id,
          );
          oldData = {
            ...oldData,
            group,
          };

          group = await this.groupRepository.findOne(
            newData.group_id,
          );
          newData = {
            ...newData,
            group,
          };
          listChange.push('group_id');
        }

        if (oldData.area_id !== newData.area_id) {
          let area = await this.areaRepository.findOne(
            oldData.area_id,
          );
          oldData = {
            ...oldData,
            area,
          };

          area = await this.areaRepository.findOne(newData.area_id);
          newData = {
            ...newData,
            area,
          };
          listChange.push('area_id');
        }

        if (
          oldData.position_id !== newData.position_id
        ) {
          let position = await this.positionRepository.findOne(
            oldData.position_id,
          );
          oldData = {
            ...oldData,
            position,
          };

          position = await this.positionRepository.findOne(
            newData.position_id,
          );
          newData = {
            ...newData,
            position,
          };
          listChange.push('position_id');
        }

        if (oldData.meta && newData.meta) {
          const keys = await Object.keys(oldData.meta.payslip);
          for (const key of keys) {
            if (oldData.meta.payslip[key] !== newData.meta.payslip[key]) {
              listChange.push('meta.payslip' + key);
            }
          }
        }
      }

      if (res.entity === ENTITIES.attendance) {
        if (oldData.meta && newData.meta) {
          const keys = await Object.keys(oldData.meta);
          const excludes = LOG_GROUP_EXCLUDE;
          for (const key of keys) {
            if (!excludes.includes(key) && oldData.meta[key] !== newData.meta[key]) {
              listChange.push(key);
            }
          }
        }
      }

      if (res.entity === ENTITIES.group) {
        if (oldData.base_salary !== newData.base_salary) {
          listChange.push('base_salary');
        }
      }
    } else if (res.action === 'DELETE') { // ------------------- DELETE -----------------------
      const department = await this.departmentRepository.findOne(
        oldData.department_id,
      );
      oldData = {
        ...oldData,
        department,
      };

      const group = await this.groupRepository.findOne(
        oldData.group_id,
      );
      oldData = {
        ...oldData,
        group,
      };

      const area = await this.areaRepository.findOne(
        oldData.area_id,
      );
      oldData = {
        ...oldData,
        area,
      };

      const position = await this.positionRepository.findOne(
        oldData.position_id,
      );
      oldData = {
        ...oldData,
        position,
      };
    }

    return {
      ...res,
      meta: {
        ...res.meta,
        previous_data: oldData,
        current_data: newData,
      },
      listChange,
    };
  }
}
