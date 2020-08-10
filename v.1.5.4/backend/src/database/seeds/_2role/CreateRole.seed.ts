import { SeedData } from './RoleSeed';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';
import { Role } from '../../../auth/role/role.entity';

export class CreateRole implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .getRepository(Role)
      .createQueryBuilder()
      .delete()
      .where('')
      .execute();
    await connection
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(SeedData)
      .execute();
  }
}
