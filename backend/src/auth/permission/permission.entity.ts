import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RolePermission } from '../../auth/rolePermission/rolePermission.entity';
import { Type } from 'class-transformer';
import { AccountPermission } from '../../auth/accountPermission/accountPermission.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('permissions')
export class Permission extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  name: string;

  @OneToMany(
    () => RolePermission,
    role_permission => role_permission.permission,
  )
  @Type(() => RolePermission)
  role_permissions: RolePermission[];

  @OneToMany(
    () => AccountPermission,
    account_permission => account_permission.permission,
  )
  @Type(() => AccountPermission)
  account_permissions: AccountPermission[];

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
