import { ApiModelProperty } from '@nestjs/swagger';

export class MetaPayslip {
    @ApiModelProperty({ example: [] })
    base: any;

    @ApiModelProperty({ example: [] })
    rewards: any;

    @ApiModelProperty({ example: [] })
    deductions: any;
}