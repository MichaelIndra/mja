import { ApiModelProperty } from '@nestjs/swagger';

export class GetEmployeeDataForPayslipDto {
  @ApiModelProperty()
  department_id?: string;

  @ApiModelProperty()
  date_start?: Date;

  @ApiModelProperty()
  date_end?: Date;

  @ApiModelProperty()
  status?: string;
}
