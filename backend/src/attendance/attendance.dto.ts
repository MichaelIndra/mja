import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAttendanceDto {
  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  employee_id?: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString({ always: true })
  employee_nik?: string;

  @ApiModelProperty({ example: new Date() })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  time_check_in: Date;

  @ApiModelProperty({ example: new Date() })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  time_check_out: Date;

  @ApiModelProperty({ example: new Date() })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  time_check_out_for_break: Date;

  @ApiModelProperty({ example: new Date() })
  @IsNotEmpty({ always: true })
  @IsDateString({ always: true })
  time_check_in_for_break: Date;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNotEmpty({ always: true })
  meta: any;
}
export class CreateManyAttendanceDto{
  @ApiModelProperty()
  @IsNotEmpty({ always: true })
  bulk: CreateAttendanceDto[];
}
