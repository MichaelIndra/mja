import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './position.entity';
import {Department} from '../../department.entity';
import {In} from 'typeorm';

@Injectable()
export class PositionService extends TypeOrmCrudService<Position> {
  constructor(@InjectRepository(Position) repo) {
    super(repo);
  }
  async findByName(names: string[]): Promise<Position[]> {
    try {
      if (names.length === 0) {
        return Promise.reject({
          statusCode: 400,
          message: 'Position name must be an array of string',
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

}
