import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Account } from '../auth/account/account.entity';
import { MetaLog } from './log.meta';

const { CREATE } = CrudValidationGroups;

@Entity('logs')
export class Log extends BaseEntity {
  @ApiModelProperty()
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50 })
  entity: string;

  @ApiModelProperty()
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 20 })
  action: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  account_id: string;

  @ManyToOne(() => Account, account => account.logs, {
    cascade: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'json', nullable: true })
  meta: MetaLog;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
