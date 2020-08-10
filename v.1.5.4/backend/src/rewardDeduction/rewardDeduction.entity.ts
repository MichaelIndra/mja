import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../base.entity';
import uuid = require('uuid');
import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Employee } from '../employee/employee.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('reward_deductions')
export class RewardDeduction extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50 })
  employee_id: string;
  @ManyToOne(() => Employee, employee => employee.reward_deductions, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50 })
  name: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Column()
  type: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Column({ type: 'text' })
  description: string;

  @ApiModelProperty({ example: new Date() })
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  @Column({ length: 20 })
  date: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Column({ length: 15 })
  value: string;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
