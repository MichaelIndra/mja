import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Type } from 'class-transformer';
import { Employee } from '../../employee/employee.entity';
import { AccountRole } from '../accountRole/accountRole.entity';
import { AccountPermission } from '../accountPermission/accountPermission.entity';
import { encryptPassword } from '../../utils/encrypt';
import { Branch } from '../../branch/branch.entity';
import { PaySlip } from '../../paySlip/paySlip.entity';
import { Log } from '../../log/log.entity';
import { Loan } from '../../loan/loan.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('accounts')
export class Account extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  first_name: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  last_name?: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  avatar?: string;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ unique: true })
  username: string;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ unique: true })
  email: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  branch_id: string;

  @ManyToOne(() => Branch, branch => branch.accounts, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @OneToMany(() => Employee, employee => employee.account)
  @Type(() => Employee)
  employees: Employee[];

  @OneToMany(() => AccountRole, account_role => account_role.account)
  @Type(() => AccountRole)
  account_roles: AccountRole[];

  @OneToMany(
    () => AccountPermission,
    account_permission => account_permission.account,
  )
  @Type(() => AccountPermission)
  account_permissions: AccountPermission[];

  @OneToMany(
    () => PaySlip,
    payslip => payslip.created_by,
  )
  @Type(() => PaySlip)
  payslips: PaySlip[];

  @OneToMany(
    () => Log,
    log => log.account,
  )
  @Type(() => Log)
  logs: Log[];

  @OneToMany(
    () => Loan,
    loan => loan.created_by,
  )
  @Type(() => Loan)
  loans: Loan[];

  @BeforeInsert()
  hashPassword() {
    this.password = encryptPassword(this.password);
  }
  @ApiModelProperty()
  @Column()
  password: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  token_reset_password?: string | null;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
