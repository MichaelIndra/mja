import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class RoleDto {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  name: string;

  @ApiModelPropertyOptional()
  description: string;
}
