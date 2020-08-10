import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';

export class DeleteManyDto {
    @ApiModelProperty({ example: false })
    isAllSelected: boolean;

    @ApiModelPropertyOptional()
    ids?: string[];

    @ApiModelPropertyOptional()
    query?: string;
}