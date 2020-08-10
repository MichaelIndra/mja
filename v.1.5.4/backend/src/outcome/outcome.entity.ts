import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { Account } from '../auth/account/account.entity';
import { Department } from '../department/department.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('outcomes')
export class Outcome extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  // @IsJSON({ always: true })
  @Column({ type: 'json' })
  employee_payslip: any;

  @Column()
  created_by_id: string;

  @ManyToOne(
    () => Account,
    account => account.loans,
    {
      cascade: true,
      onDelete: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'created_by_id' })
  created_by: Account;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  department_id: string;

  @ManyToOne(
    () => Department,
    department => department.employees,
    {
      cascade: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ApiModelProperty({ example: new Date() })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsDateString({ always: true })
  @Column({ type: 'timestamp', nullable: true })
  start_at: Date;

  @ApiModelProperty({ example: new Date() })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsDateString({ always: true })
  @Column({ type: 'timestamp', nullable: true })
  end_at: Date;

  @ApiModelProperty({ example: 10000 })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  nominal_per_period: number;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
