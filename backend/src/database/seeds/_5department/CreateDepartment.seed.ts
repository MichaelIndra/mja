import { SeedData } from './DepartmentSeed';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import {Department} from '../../../department/department.entity';

export class CreateDepartment implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .getRepository(Department)
      .createQueryBuilder()
      .delete()
      .where('')
      .execute();
    await connection
      .createQueryBuilder()
      .insert()
      .into(Department)
      .values(SeedData)
      .execute();
  }
}
