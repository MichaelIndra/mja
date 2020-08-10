import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../../auth/role/role.entity';
import { Permission } from '../../auth/permission/permission.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('role_permissions')
export class RolePermission extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  role_id: string;

  @ManyToOne(() => Role, role => role.role_permissions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  permission_id: string;

  @ManyToOne(() => Permission, permission => permission.role_permissions, {
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
