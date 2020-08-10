import { SeedData } from './GroupSeed';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import {Group} from '../../../department/group/group.entity';

export class CreateGroup implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .getRepository(Group)
      .createQueryBuilder()
      .delete()
      .where('')
      .execute();
    await connection
      .createQueryBuilder()
      .insert()
      .into(Group)
      .values(SeedData)
      .execute();
  }
}
