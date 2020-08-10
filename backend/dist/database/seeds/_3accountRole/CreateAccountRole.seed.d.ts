import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';
export declare class CreateAccountRole implements Seeder {
    run(factory: Factory, connection: Connection): Promise<any>;
}
