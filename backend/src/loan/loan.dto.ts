import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class QueryCurrentLoanDto {
    @ApiModelPropertyOptional()
    employee_id?: string;
}
