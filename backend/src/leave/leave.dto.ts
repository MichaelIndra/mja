import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';

export class DeleteManyLeaveDto {
  @ApiModelProperty({ example: false })
  isAllSelected: boolean;

  @ApiModelPropertyOptional()
  ids?: string[];

  @ApiModelPropertyOptional()
  query?: string;
}
