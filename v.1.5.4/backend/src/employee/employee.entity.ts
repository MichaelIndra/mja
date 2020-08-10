import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Department } from '../department/department.entity';
import { Type } from 'class-transformer';
import { Attendance } from '../attendance/attendance.entity';
import { PaySlip } from '../paySlip/paySlip.entity';
import { Leave } from '../leave/leave.entity';
import { RewardDeduction } from '../rewardDeduction/rewardDeduction.entity';
import { Account } from '../auth/account/account.entity';
import { Group } from '../department/group/group.entity';
import { Position } from '../department/area/position/position.entity';
import { Area } from '../department/area/area.entity';
import { EnumEmployeeStatus } from './employee.enum';
import { Loan } from '../loan/loan.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('employees')
export class Employee extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 20, unique: true })
  nik: string;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50 })
  name: string;

  @ApiModelPropertyOptional({
    description: `Available type : [ ${Object.values(EnumEmployeeStatus).join(',')} ]`,
    nullable: true,
    example: EnumEmployeeStatus.REGULER,
  })
  @IsOptional({ always: true})
  @Column({ length: 50, default: EnumEmployeeStatus.REGULER })
  status?: EnumEmployeeStatus;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiModelProperty({ example: false })
  @IsOptional({ always: true })
  @IsBoolean({ always: true })
  @Column({ default: false })
  active?: boolean;

  @ApiModelProperty({ example: new Date() })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsDateString({ always: true })
  @Column({ nullable: true })
  active_date: Date;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  department_id: string;

  @ManyToOne(() => Department, department => department.employees, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  group_id: string;

  @ManyToOne(() => Group, group => group.employees, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  area_id: string;

  @ManyToOne(() => Area, area => area.employees, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  position_id: string;

  @ManyToOne(() => Position, position => position.employees, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  created_by: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  picture?: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({nullable: true})
  date_of_birth?: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  phone_no?: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ length: 20, nullable: true })
  bpjs_id?: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ length: 20, nullable: true })
  npwp_id?: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'json', nullable: true })
  meta: any;

  @ManyToOne(() => Account, account => account.employees, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'created_by' })
  account: Account;

  @OneToMany(() => PaySlip, payslip => payslip.employee)
  @Type(() => PaySlip)
  payslips: PaySlip[];

  @OneToMany(() => Leave, leave => leave.employee)
  @Type(() => Leave)
  leaves: Leave[];

  @OneToMany(() => Loan, loan => loan.employee)
  @Type(() => Loan)
  loans: Loan[];

  @OneToMany(() => RewardDeduction, rewardDeduction => rewardDeduction.employee)
  @Type(() => RewardDeduction)
  reward_deductions: RewardDeduction[];

  @OneToMany(() => Attendance, attendance => attendance.employee)
  @Type(() => Attendance)
  attendances: Attendance[];

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
