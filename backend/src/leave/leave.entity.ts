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

@Entity('leaves')
export class Leave extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  employee_id: string;
  @ManyToOne(() => Employee, employee => employee.leaves, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ type: 'text' })
  description: string;

  @ApiModelProperty({ example: new Date() })
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  @Column()
  date_start: Date;

  @ApiModelProperty({ example: new Date() })
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  @Column()
  date_end: Date;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
