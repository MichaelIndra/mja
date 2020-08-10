import { Entity, Column, BeforeInsert } from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('reports')
export class Report extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ unique: true })
  id_Report: string;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  date: Date;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  nik: string;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  time_of_entry: Date;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  time_of_out: Date;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  time_start_break: Date;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  time_end_break: Date;

  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column()
  description: string;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
