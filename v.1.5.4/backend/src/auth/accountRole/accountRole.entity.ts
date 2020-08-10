import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import uuid = require('uuid');
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Account } from '../account/account.entity';
import { Role } from '../role/role.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('account_roles')
export class AccountRole extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  account_id: string;

  @ManyToOne(() => Account, account => account.account_roles, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  role_id: string;

  @ManyToOne(() => Role, role => role.account_roles, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
