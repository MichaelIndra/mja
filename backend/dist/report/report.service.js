"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const paySlip_entity_1 = require("../paySlip/paySlip.entity");
const attendance_entity_1 = require("../attendance/attendance.entity");
const outcome_entity_1 = require("../outcome/outcome.entity");
let ReportService = class ReportService {
    constructor(outcomeRepository, payslipRepository, attendanceRepository) {
        this.outcomeRepository = outcomeRepository;
        this.payslipRepository = payslipRepository;
        this.attendanceRepository = attendanceRepository;
    }
    getMostLateEmployeeMonthly(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = query.date.split('-');
                const month = Number(date[1]);
                const year = Number(date[0]);
                const start_at = new Date(Number(year), Number(month) - 1, 1, 0, 0, 0).toLocaleString();
                const end_at = new Date(Number(year), Number(month) - 1 + 1, 1, 0, 0, 0).toLocaleString();
                console.info(' ==>> START END DATE', start_at, end_at);
                const queryBuilder = yield this.payslipRepository
                    .createQueryBuilder('payslip')
                    .select('payslip.*')
                    .leftJoin('payslip.employee', 'employee')
                    .addSelect(`employee.name`, 'name')
                    .addSelect(`employee.id`, 'employee_id')
                    .leftJoin('employee.department', 'department')
                    .addSelect('department.name', 'department_name')
                    .addSelect(`department.meta ->> '$.payslip_filter'`, 'payslip_filter')
                    .where(`department.meta -> '$.payslip_filter' = 2`)
                    .andWhere(`((YEAR(start_at) = :year AND MONTH(start_at) = :month) OR (YEAR(end_at) = :year AND MONTH(end_at) = :month))`, { month, year })
                    .orderBy(`total`, 'DESC');
                let list = yield queryBuilder.execute();
                list = list.map((el) => {
                    let find = {};
                    const payslip_type = el.employee_meta.department.meta.payslip_type;
                    const payslip_filter = el.employee_meta.department.meta.payslip_filter;
                    let total_late = 0;
                    let nominal_late = 0;
                    let total_leave = 0;
                    let nominal_leave = 0;
                    let total = 0;
                    if (el.payslip_meta.employee_deductions &&
                        el.payslip_meta.employee_deductions.length > 0) {
                        el.payslip_meta.employee_deductions.forEach((data) => {
                            let late_deduction = { result: 0, leftover: 0 };
                            let leave_deduction = { result: 0, leftover: 0 };
                            let late_duration = 0;
                            let leave_duration = 0;
                            if (data.type === 'late') {
                                late_deduction = this.calculateWorkingDays(data.total_late, 1800);
                                late_duration = late_deduction.result;
                                if (payslip_type === '2' && payslip_filter === 2) {
                                    if (late_deduction.leftover > 0 &&
                                        late_deduction.leftover < 1800) {
                                        late_duration += late_deduction.leftover;
                                    }
                                }
                                else if (payslip_type === '1' && payslip_filter === 1) {
                                    if (late_deduction.leftover > 0 &&
                                        late_deduction.leftover < 1800) {
                                        late_duration += 1800;
                                    }
                                    else if (late_deduction.leftover >= 1800) {
                                        late_duration += 3600;
                                    }
                                }
                                else if (payslip_type === '2' && payslip_filter === 1) {
                                    if (late_deduction.leftover > 0 &&
                                        late_deduction.leftover < 1800) {
                                        late_duration += late_deduction.leftover;
                                    }
                                    else if (late_deduction.leftover >= 1800) {
                                        late_duration += 3600;
                                    }
                                }
                            }
                            if (data.type === 'leave') {
                                leave_deduction = this.calculateWorkingDays(data.total_leave, 1800);
                                leave_duration = leave_deduction.result;
                                if (leave_deduction.leftover > 0 &&
                                    leave_deduction.leftover < 1800) {
                                    leave_duration += 1800;
                                }
                                else if (leave_deduction.leftover >= 1800) {
                                    leave_duration += 3600;
                                }
                            }
                            if (data.type === 'both') {
                                total_late += late_duration;
                                nominal_late += data.cost;
                                total_leave += leave_duration;
                                nominal_leave += data.cost;
                            }
                            else if (data.type === 'late') {
                                total_late += late_duration;
                                nominal_late += data.cost;
                            }
                            else if (data.type === 'leave') {
                                total_leave += leave_duration;
                                nominal_leave += data.cost;
                            }
                            total += data.cost;
                        });
                    }
                    if (payslip_type === '1' || payslip_type === '2') {
                        find = Object.assign(Object.assign({}, el), { total_late,
                            nominal_late,
                            total_leave,
                            nominal_leave,
                            total, raw_total_late: total_late, raw_total_leave: total_leave, raw_total: total_late + total_leave });
                    }
                    else if (payslip_type === '3') {
                        const raw_total_late = el.payslip_meta.attendance_calculation.durasi_terlambat;
                        const raw_total_leave = el.payslip_meta.deductions.jumlah_potongan_hari * 3600 * 24 +
                            el.payslip_meta.deductions.jumlah_potongan_izin * 3600;
                        find = Object.assign(Object.assign({}, el), { total_late: el.payslip_meta.attendance_calculation.durasi_terlambat +
                                ' menit', nominal_late: el.payslip_meta.deductions.potongan_terlambat, total_leave: el.payslip_meta.deductions.jumlah_potongan_hari +
                                ' hari ' +
                                el.payslip_meta.deductions.jumlah_potongan_izin +
                                ' jam', nominal_leave: el.payslip_meta.deductions.potongan_hari_kerja, total: el.payslip_meta.deductions.potongan_terlambat +
                                el.payslip_meta.deductions.potongan_hari_kerja, raw_total_late,
                            raw_total_leave, raw_total: raw_total_late + raw_total_leave });
                    }
                    else {
                        return el;
                    }
                    return find;
                });
                list.sort((a, b) => {
                    return b.raw_total - a.raw_total;
                });
                list = list.filter((item, key) => key < 10);
                return list;
                return list;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    getMostDiligentEmployeeMonthly(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = query.date.split('-');
                const month = Number(date[1]);
                const year = Number(date[0]);
                const queryBuilder = yield this.attendanceRepository
                    .createQueryBuilder('attendances')
                    .select('employees.name', 'employee_name')
                    .addSelect('departments.name', 'department_name')
                    .addSelect(`SUM(attendances.meta ->> '$.totalLate')`, 'total_late')
                    .addSelect(`SUM(attendances.meta ->> '$.totalLeave')`, 'total_leave')
                    .addSelect(`SUM(attendances.meta ->> '$.totalWork')`, 'total_work')
                    .addSelect('count(attendances.id)', 'total_day_work')
                    .addSelect(`SUM(attendances.meta ->> '$.totalWork') - (SUM(attendances.meta ->> '$.totalLate') + SUM(attendances.meta ->> '$.totalLeave'))`, 'temp_late_leave')
                    .leftJoin('attendances.employee', 'employees')
                    .leftJoin('employees.department', 'departments')
                    .where(`MONTH(attendances.time_check_in) = :month`, { month })
                    .andWhere(`YEAR(attendances.time_check_in) = :year`, { year })
                    .groupBy('attendances.employee_id')
                    .orderBy('temp_late_leave', 'DESC')
                    .limit(10);
                const res = yield queryBuilder.execute();
                return res;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    getMostLateEmployeeWeekly(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const start = query.dateStart.slice(0, 23);
                const end = query.dateEnd.slice(0, 23);
                const queryBuilder = yield this.payslipRepository
                    .createQueryBuilder('payslip')
                    .select('payslip.id', 'id')
                    .addSelect('payslip.created_at', 'created_at')
                    .addSelect(`payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat'`, 'late_duration')
                    .addSelect(`payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`, 'leave_duration')
                    .addSelect(`payslip.payslip_meta ->> '$.attendance_calculation.durasi_terlambat' + payslip.payslip_meta ->> '$.attendance_calculation.durasi_izin'`, 'total')
                    .leftJoin('payslip.employee', 'employee')
                    .addSelect(`employee.name`, 'name')
                    .addSelect(`employee.id`, 'employee_id')
                    .leftJoin('employee.department', 'department')
                    .addSelect('department.name', 'department_name')
                    .addSelect(`department.meta ->> '$.payslip_filter'`, 'payslip_filter')
                    .where(`department.meta -> '$.payslip_filter' = 1`)
                    .andWhere(`payslip.created_at BETWEEN :start AND :end`, { start, end })
                    .orderBy(`total`, 'DESC')
                    .limit(10);
                const res = yield queryBuilder.execute();
                return res;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    getTotalCost(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let month_before;
                let year_before;
                if (Number(query.month) === 1) {
                    month_before = 12;
                    year_before = Number(query.year) - 1;
                }
                else {
                    month_before = Number(query.month) - 1;
                    year_before = Number(query.year);
                }
                const queryBuilderCurrent = this.outcomeRepository
                    .createQueryBuilder('outcomes')
                    .select('SUM(outcomes.nominal_per_period)', 'sum_total')
                    .where('(MONTH(start_at) = :month AND YEAR(start_at) = :year) AND (MONTH(end_at) = :month AND YEAR(end_at) = :year)', { month: query.month, year: query.year });
                const queryBuilderBefore = this.outcomeRepository
                    .createQueryBuilder('outcomes')
                    .select('SUM(outcomes.nominal_per_period)', 'sum_total')
                    .where('(MONTH(start_at) = :month AND YEAR(start_at) = :year) AND (MONTH(end_at) = :month AND YEAR(end_at) = :year)', { month: month_before, year: year_before });
                const queryBuilderCurrentOvertime = this.payslipRepository
                    .createQueryBuilder('payslips')
                    .select(`SUM(payslips.payslip_meta ->> '$.attendance_calculation.tambahan_lembur')`, 'overtime_total')
                    .where('(MONTH(start_at) = :month AND YEAR(start_at) = :year) AND (MONTH(end_at) = :month AND YEAR(end_at) = :year)', { month: query.month, year: query.year });
                const queryBuilderBeforeOvertime = this.payslipRepository
                    .createQueryBuilder('payslips')
                    .select(`SUM(payslips.payslip_meta ->> '$.attendance_calculation.tambahan_lembur')`, 'overtime_total')
                    .where('(MONTH(start_at) = :month AND YEAR(start_at) = :year) AND (MONTH(end_at) = :month AND YEAR(end_at) = :year)', { month: month_before, year: year_before });
                const resCurrent = yield queryBuilderCurrent.execute();
                const resBefore = yield queryBuilderBefore.execute();
                const resOvertimeCurrent = yield queryBuilderCurrentOvertime.execute();
                const resOvertimeBefore = yield queryBuilderBeforeOvertime.execute();
                return {
                    current_year: Number(query.year),
                    current_month: Number(query.month),
                    current_total: resCurrent[0] ? resCurrent[0].sum_total : 0,
                    before_year: Number(year_before),
                    before_month: Number(month_before),
                    before_total: resBefore[0] ? resBefore[0].sum_total : 0,
                    total_overtime_current: resOvertimeCurrent[0]
                        ? resOvertimeCurrent[0].overtime_total
                        : 0,
                    total_overtime_before: resOvertimeBefore[0]
                        ? resOvertimeBefore[0].overtime_total
                        : 0,
                };
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    getTotalCostOld(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilderCurrent = yield this.payslipRepository
                    .createQueryBuilder('payslips')
                    .select('SUM(payslips.total)', 'sum_total')
                    .where('(MONTH(start_at) = :month AND YEAR(start_at) = :year) OR (MONTH(end_at) = :month AND YEAR(end_at) = :year)', { month: query.month, year: query.year });
                let month_before;
                let year_before;
                if (Number(query.month) === 1) {
                    month_before = 12;
                    year_before = Number(query.year) - 1;
                }
                else {
                    month_before = Number(query.month) - 1;
                    year_before = Number(query.year);
                }
                const queryBuilderBefore = yield this.payslipRepository
                    .createQueryBuilder('payslips')
                    .select('SUM(payslips.total)', 'sum_total')
                    .addSelect(`SUM(payslips.payslip_meta ->> '$.attendance_calculation.tambahan_lembur')`, 'overtime_total')
                    .where('(MONTH(start_at) = :month AND YEAR(start_at) = :year) AND (MONTH(end_at) = :month AND YEAR(end_at) = :year)', { month: month_before, year: year_before });
                const resCurrent = yield queryBuilderCurrent.execute();
                const resBefore = yield queryBuilderBefore.execute();
                const prev = queryBuilderBefore.getSql();
                const dataReport = {
                    current_year: Number(query.year),
                    current_month: Number(query.month),
                    current_total: resCurrent[0] ? resCurrent[0].sum_total : 0,
                    before_year: Number(year_before),
                    before_month: Number(month_before),
                    before_total: resBefore[0] ? resBefore[0].sum_total : 0,
                    total_overtime_current: resCurrent[0]
                        ? resCurrent[0].overtime_total
                        : 0,
                    total_overtime_before: resBefore[0] ? resBefore[0].overtime_total : 0,
                };
                console.info('yonan2', prev);
                return {
                    current_year: Number(query.year),
                    current_month: Number(query.month),
                    current_total: resCurrent[0] ? resCurrent[0].sum_total : 0,
                    before_year: Number(year_before),
                    before_month: Number(month_before),
                    before_total: resBefore[0] ? resBefore[0].sum_total : 0,
                    total_overtime_current: resCurrent[0]
                        ? resCurrent[0].overtime_total
                        : 0,
                    total_overtime_before: resBefore[0] ? resBefore[0].overtime_total : 0,
                };
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    calculateWorkingDays(totalWorkHours, divider) {
        let temp = 0;
        while (totalWorkHours >= divider) {
            temp += divider;
            totalWorkHours -= divider;
        }
        return {
            result: temp,
            leftover: totalWorkHours,
        };
    }
};
ReportService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(outcome_entity_1.Outcome)),
    __param(1, typeorm_1.InjectRepository(paySlip_entity_1.PaySlip)),
    __param(2, typeorm_1.InjectRepository(attendance_entity_1.Attendance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportService);
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map