import { QueryReportCost, QueryEmployeeLateWeekly, QueryEmployeeLateMonthly } from './query.dto';
import { Repository } from 'typeorm';
import { PaySlip } from '../paySlip/paySlip.entity';
import { Attendance } from '../attendance/attendance.entity';
import { Outcome } from '../outcome/outcome.entity';
export declare class ReportService {
    private readonly outcomeRepository;
    private readonly payslipRepository;
    private readonly attendanceRepository;
    constructor(outcomeRepository: Repository<Outcome>, payslipRepository: Repository<PaySlip>, attendanceRepository: Repository<Attendance>);
    getMostLateEmployeeMonthly(query: QueryEmployeeLateMonthly): Promise<any>;
    getMostDiligentEmployeeMonthly(query: QueryEmployeeLateMonthly): Promise<any>;
    getMostLateEmployeeWeekly(query: QueryEmployeeLateWeekly): Promise<any>;
    getTotalCost(query: QueryReportCost): Promise<{
        current_year: number;
        current_month: number;
        current_total: any;
        before_year: number;
        before_month: number;
        before_total: any;
        total_overtime_current: any;
        total_overtime_before: any;
    }>;
    getTotalCostOld(query: QueryReportCost): Promise<{
        current_year: number;
        current_month: number;
        current_total: any;
        before_year: number;
        before_month: number;
        before_total: any;
        total_overtime_current: any;
        total_overtime_before: any;
    }>;
    calculateWorkingDays(totalWorkHours: number, divider: number): {
        result: number;
        leftover: number;
    };
}
