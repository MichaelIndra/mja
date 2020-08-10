import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { RolePermission } from '../../auth/rolePermission/rolePermission.entity';
import { AccountRole } from '../../auth/accountRole/accountRole.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('roles')
export class Role extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ unique: true })
  name: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  description: string;

  @OneToMany(() => RolePermission, role_permission => role_permission.role)
  @Type(() => RolePermission)
  role_permissions: RolePermission[];

  @OneToMany(() => AccountRole, account_role => account_role.role)
  @Type(() => AccountRole)
  account_roles: AccountRole[];

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
