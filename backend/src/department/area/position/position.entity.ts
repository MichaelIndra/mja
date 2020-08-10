import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from '../../../base.entity';
import uuid = require('uuid');
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Area } from '../area.entity';
import { Type } from 'class-transformer';
import { Employee } from '../../../employee/employee.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('positions')
export class Position extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 50 })
  name: string;

  @ApiModelPropertyOptional({ description: 'Bonus' })
  @IsOptional({ always: true })
  @IsString({ always: false })
  @Column({ length: 15, nullable: true })
  bonus?: string | null;

  @ApiModelProperty()
  @IsString({ always: true })
  @Column()
  area_id: string;

  @ManyToOne(() => Area, area => area.positions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @OneToMany(() => Employee, employee => employee.area)
  @Type(() => Employee)
  employees: Employee[];

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
