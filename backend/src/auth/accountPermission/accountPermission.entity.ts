import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Account } from '../account/account.entity';
import { Permission } from '../permission/permission.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('account_permissions')
export class AccountPermission extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  account_id: string;

  @ManyToOne(() => Account, account => account.account_permissions, {
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
  permission_id: string;

  @ManyToOne(() => Permission, permission => permission.account_permissions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
