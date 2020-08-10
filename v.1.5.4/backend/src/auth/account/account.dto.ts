import { BeforeInsert, Column } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { RoleDto } from '../../auth/role/role.dto';

export class AccountDto {
  @ApiModelProperty()
  @Column()
  first_name: string;

  @ApiModelProperty()
  last_name?: string;

  @ApiModelPropertyOptional()
  avatar?: string;

  @ApiModelProperty()
  @Column({ unique: true })
  username: string;

  @ApiModelProperty()
  @Column()
  password: string;

  @ApiModelProperty()
  @Column({ unique: true })
  email: string;

  @ApiModelProperty()
  @Column()
  roles: RoleDto[];

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }
}
