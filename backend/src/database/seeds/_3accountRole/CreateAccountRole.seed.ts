import { SeedData } from './AccountRoleSeed';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';
import { AccountRole } from '../../../auth/accountRole/accountRole.entity';

export class CreateAccountRole implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .getRepository(AccountRole)
      .createQueryBuilder()
      .delete()
      .where('')
      .execute();
    await connection
      .createQueryBuilder()
      .insert()
      .into(AccountRole)
      .values(SeedData)
      .execute();
  }
}
