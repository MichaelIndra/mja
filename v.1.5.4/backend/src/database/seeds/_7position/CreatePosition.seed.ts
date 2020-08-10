import { SeedData } from './PositionSeed';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import {Position} from '../../../department/area/position/position.entity';

export class CreatePosition implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .getRepository(Position)
      .createQueryBuilder()
      .delete()
      .where('')
      .execute();
    await connection
      .createQueryBuilder()
      .insert()
      .into(Position)
      .values(SeedData)
      .execute();
  }
}
