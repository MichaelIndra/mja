import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Department } from '../department/department.entity';
import { Account } from '../auth/account/account.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('branchs')
export class Branch extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50, unique: true })
  name: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ length: 6, nullable: true })
  postal_code?: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ length: 15, nullable: true })
  telp?: string;

  @OneToMany(() => Department, department => department.branch)
  @Type(() => Department)
  departments: Department[];

  @OneToMany(() => Account, account => account.branch)
  @Type(() => Account)
  accounts: Account[];

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
