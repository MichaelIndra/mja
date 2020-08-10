import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { Employee } from '../employee/employee.entity';
import { Account } from '../auth/account/account.entity';
import { ELoanType } from './loan.enum';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('loans')
export class Loan extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  employee_id: string;

  @ManyToOne(() => Employee, employee => employee.loans, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  created_by_id: string;

  @ManyToOne(() => Account, account => account.loans, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'created_by_id' })
  created_by: Account;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ default: ELoanType.LOAN })
  type: ELoanType;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiModelProperty({ example: new Date() })
  @IsOptional({ groups: [UPDATE]})
  @IsNotEmpty({ groups: [CREATE] })
  @IsDateString({ always: true })
  @Column({ type: 'timestamp', nullable: true })
  loan_date: Date;

  @ApiModelProperty({ example: 10000 })
  @IsOptional({ groups: [UPDATE]})
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  nominal: number;

  @Column({ default: 0 })
  total_loan_before: number;

  @Column({ default: 0 })
  total_loan_current: number;

  @Column({ default: 0 })
  total_pay_before: number;

  @Column({ default: 0 })
  total_pay_current: number;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
