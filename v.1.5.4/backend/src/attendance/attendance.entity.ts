import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import uuid = require('uuid');
import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { Employee } from '../employee/employee.entity';

@Entity('attendances')
export class Attendance extends BaseEntity {
  @ApiModelProperty()
  @IsString({ always: true })
  @Column()
  employee_id: string;

  @ManyToOne(() => Employee, employee => employee.attendances, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ApiModelProperty({ example: new Date() })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  @Column()
  time_check_in: Date;

  @ApiModelProperty({ example: new Date() })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  @Column()
  time_check_out: Date;

  @ApiModelProperty({ example: new Date() })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  @Column()
  time_check_out_for_break: Date;

  @ApiModelProperty({ example: new Date() })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  @Column()
  time_check_in_for_break: Date;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  // @IsJSON({ always: true })
  @Column({ type: 'json', nullable: true })
  meta: any;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
