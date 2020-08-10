import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddColumnDescriptionToLoan1578902706234 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<any>;
    down(queryRunner: QueryRunner): Promise<any>;
}
