import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Employee } from '../employee/employee.entity';
import { Group } from './group/group.entity';
import { Area } from './area/area.entity';
import { Branch } from '../branch/branch.entity';
import {Outcome} from '../outcome/outcome.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('departments')
export class Department extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50 })
  name: string;

  @ApiModelProperty()
  @IsString({ always: true })
  @Column()
  branch_id: string;

  @ManyToOne(() => Branch, branch => branch.departments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'json', nullable: true })
  meta: any;

  @OneToMany(() => Employee, employee => employee.department)
  @Type(() => Employee)
  employees: Employee[];

  @OneToMany(() => Outcome, outcome => outcome.department)
  @Type(() => Outcome)
  outcomes: Outcome[];

  @OneToMany(() => Group, group => group.department)
  @Type(() => Group)
  groups: Group[];

  @OneToMany(() => Area, area => area.department)
  @Type(() => Area)
  areas: Area[];

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
