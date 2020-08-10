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
import { Type } from 'class-transformer';
import { Position } from './position/position.entity';
import { Employee } from '../../employee/employee.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('areas')
export class Area extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50 })
  name: string;

  @ApiModelPropertyOptional({ description: 'Bonus' })
  @IsOptional({ always: true })
  @IsString({ always: false })
  @Column({ length: 15, nullable: true })
  bonus?: string | null;

  @ApiModelProperty()
  @IsString({ always: true })
  @Column()
  department_id: string;

  @ManyToOne(() => Department, department => department.areas, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => Position, position => position.area)
  @Type(() => Position)
  positions: Position[];

  @OneToMany(() => Employee, employee => employee.area)
  @Type(() => Employee)
  employees: Employee[];

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
