import { SeedData } from './AreaSeed';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Area } from '../../../department/area/area.entity';

export class CreateArea implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .getRepository(Area)
      .createQueryBuilder()
      .delete()
      .where('')
      .execute();
    await connection
      .createQueryBuilder()
      .insert()
      .into(Area)
      .values(SeedData)
      .execute();
  }
}
