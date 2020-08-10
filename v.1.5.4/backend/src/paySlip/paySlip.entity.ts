import {Entity, Column, BeforeInsert, ManyToOne, JoinColumn, Unique} from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../base.entity';
import uuid = require('uuid');
import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Employee } from '../employee/employee.entity';
import { MetaPayslip } from './paySlip.dto';
import { Account } from '../auth/account/account.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('payslips')
@Unique('UQ_PAYSLIP_DATA', ['start_at', 'end_at', 'employee_id'])
export class PaySlip extends BaseEntity {
  @ApiModelProperty({example: new Date()})
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  @Column()
  start_at: Date;

  @ApiModelProperty({example: new Date()})
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  @Column()
  end_at: Date;

  @ApiModelProperty({example: new Date()})
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  @Column()
  print_at: Date;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50 })
  employee_id: string;

  @ManyToOne(() => Employee, employee => employee.payslips, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  // @IsJSON({ always: true })
  @Column({ type: 'json' })
  employee_meta: any;

  @ApiModelProperty({ description: 'UMR' })
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Column({ length: 15 })
  base_salary: string;

  @ApiModelProperty({ description: 'Total max work days in one month'})
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Column({ length: 15 })
  total_day: string;

  @ApiModelProperty({ description: 'Gaji Pokok per hari' })
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Column({ length: 15 })
  daily_base_salary: string;

  @ApiModelProperty({ description: 'Upah 1 hari' })
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Column({ length: 15 })
  total_base_daily: string;

  @ApiModelProperty({ description: 'Upah 1 hari x total_day' })
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Column({ length: 15 })
  total_base: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Column({ length: 15 })
  total_reward: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Column({ length: 15 })
  total_deduction: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Column({ length: 15 })
  total: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  // @IsJSON({ always: true })
  @Column({ type: 'json' })
  payslip_meta: MetaPayslip;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50 })
  created_by_id: string;

  @ManyToOne(() => Account, account => account.payslips, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'account_id' })
  created_by: Account;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
