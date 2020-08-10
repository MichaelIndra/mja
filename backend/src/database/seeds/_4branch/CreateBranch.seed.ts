import {Factory, Seeder} from 'typeorm-seeding';
import {Connection} from 'typeorm';
import {Branch} from '../../../branch/branch.entity';
import {SeedData} from './BranchSeed';

export class CreateBranch implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any>{
    await connection
      .getRepository(Branch)
      .createQueryBuilder().delete().where('').execute();
    await connection.createQueryBuilder().insert().into(Branch).values(SeedData).execute();
  }
}