import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Department } from '../department.entity';
import { Employee } from '../../employee/employee.entity';
import { Type } from 'class-transformer';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('groups')
export class Group extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50 })
  name: string;

  @ApiModelPropertyOptional({ description: 'Monthly Salary' })
  @IsOptional({ always: true })
  @IsString({ always: false })
  @Column({ length: 15, nullable: true })
  base_salary?: string | null;

  @ApiModelPropertyOptional({ description: 'Weekly Salary' })
  @IsOptional({ always: true })
  @IsString({ always: false })
  @Column({ length: 15, nullable: true })
  week_salary?: string | null;

  @ApiModelPropertyOptional({ description: 'Daily Salary' })
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ length: 15, nullable: true })
  day_salary?: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  // @IsJSON({ always: true })
  @Column({ type: 'json' })
  schedule: any;

  @ApiModelProperty()
  @IsString({ always: true })
  @Column()
  department_id: string;

  @ManyToOne(() => Department, department => department.groups, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => Employee, employee => employee.group)
  @Type(() => Employee)
  employees: Employee[];

  @ApiModelPropertyOptional({ example: false })
  @IsOptional({ always: true })
  @Column({ default: false })
  switchable?: boolean;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
