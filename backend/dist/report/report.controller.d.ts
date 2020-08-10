import { ReportService } from './report.service';
import { QueryReportCost, QueryEmployeeLateWeekly, QueryEmployeeLateMonthly } from './query.dto';
export declare class ReportController {
    service: ReportService;
    constructor(service: ReportService);
    getTotalCost(query: QueryReportCost): Promise<any>;
    getMostLateWeekly(query: QueryEmployeeLateWeekly): Promise<any>;
    getMostLateMonthly(query: QueryEmployeeLateMonthly): Promise<any>;
    getMostDiligentEmployeeMonthly(query: QueryEmployeeLateMonthly): Promise<any>;
}
