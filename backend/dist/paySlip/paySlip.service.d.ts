import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PaySlip } from './paySlip.entity';
import { CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { LogService } from '../log/log.service';
import { Loan } from '../loan/loan.entity';
import { Repository } from 'typeorm';
export declare class PaySlipService extends TypeOrmCrudService<PaySlip> {
    private readonly loanRepo;
    private readonly logService;
    constructor(repo: any, loanRepo: Repository<Loan>, logService: LogService);
    customCreateMany(dto: CreateManyDto<PaySlip>, additionalData: any): Promise<any>;
    customUpdateMany(dto: any, additionalData: any): Promise<any>;
    customUpdateOne(req: CrudRequest, dto: PaySlip, additionalData: any): Promise<PaySlip>;
    customReplaceOne(req: CrudRequest, dto: PaySlip, additionalData: any): Promise<PaySlip>;
    customDeleteOne(req: CrudRequest, additionalData: any): Promise<any>;
    getChangeDetail(oldData: any, newData: any): Promise<any>;
    getTotalOvertime(datePrams: any): Promise<any>;
    getTotalOvertimeCustom(params: any): Promise<any>;
    getReportOvertimeEmployee(params: any): Promise<{
        data: any[];
        count: number;
        total: number;
        page: number;
        pageCount: number;
    } | {
        count: number;
        data: any[];
        page: number;
        total: number;
    }>;
    getTotalOvertimeReport(params: any): Promise<{
        total: any;
        start_at: string;
        end_at: string;
    }>;
    getOvertimeReport(params: any): Promise<{
        data: any;
        count: number;
        total: number;
        page: number;
        pageCount: number;
    } | {
        count: number;
        data: any[];
        page: number;
        total: number;
    }>;
    convertOvertimePayslipWeekly(res: any, firstDayOfMonth: string, lastDayOfMonth: string, type: string): Promise<any>;
    groupingOvertimeDataByDepartment(arr: any): Promise<any>;
    getTotalOutcomeReport(params: any): Promise<{
        total: any;
        start_at: string;
        end_at: string;
    }>;
    getOutcomeReport(params: any): Promise<{
        data: any;
        count: number;
        total: number;
        page: number;
        pageCount: number;
    } | {
        count: number;
        data: any[];
        page: number;
        total: number;
    }>;
    convertOutcomePayslips(res: any, firstDayOfMonth: string, lastDayOfMonth: string, type: string): Promise<any>;
    groupingOutcomeDataByDepartment(arr: any): Promise<any>;
    groupingOutcomeDataByPeriode(arr: any): any;
    createDateRange(start: number, end: number, month: string): any[];
    lastDayOfMonth(year: number, month: number): number;
    firstDayOfMonth(year: number, month: number): number;
}
