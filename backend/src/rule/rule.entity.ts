import { Entity, Column, BeforeInsert } from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../base.entity';
import uuid = require('uuid');
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RuleEnum } from './rule.enum';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('rules')
export class Rule extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50 })
  name: string;

  @ApiModelProperty({
    description: `available types : [${Object.keys(RuleEnum).join(', ')}]`,
  })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  type: RuleEnum;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ type: 'text' })
  value: string;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
