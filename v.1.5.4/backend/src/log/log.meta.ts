import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class MetaLog {
    @ApiModelPropertyOptional()
    previous_data: any;

    @ApiModelPropertyOptional()
    current_data: any;

    @ApiModelPropertyOptional()
    additional_data?: any;

    @ApiModelPropertyOptional()
    account?: any;
}