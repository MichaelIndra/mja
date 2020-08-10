import { SeedData } from './AccountSeed';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Account } from '../../../auth/account/account.entity';

export class CreateAccount implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .getRepository(Account)
      .createQueryBuilder()
      .delete()
      .where('')
      .execute();
    await connection
      .createQueryBuilder()
      .insert()
      .into(Account)
      .values(SeedData)
      .execute();
  }
}
