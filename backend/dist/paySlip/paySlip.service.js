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
const crud_typeorm_1 = require("@nestjsx/crud-typeorm");
const typeorm_1 = require("@nestjs/typeorm");
const paySlip_entity_1 = require("./paySlip.entity");
const log_service_1 = require("../log/log.service");
const constants_1 = require("../utils/constants");
const loan_entity_1 = require("../loan/loan.entity");
const typeorm_2 = require("typeorm");
const loan_enum_1 = require("../loan/loan.enum");
const loanCalculator_1 = require("../utils/loanCalculator");
const findDuplicate_1 = require("../utils/findDuplicate");
const uuid = require("uuid");
let PaySlipService = class PaySlipService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo, loanRepo, logService) {
        super(repo);
        this.loanRepo = loanRepo;
        this.logService = logService;
    }
    customCreateMany(dto, additionalData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (findDuplicate_1.findDuplicate(dto.bulk).length > 0) {
                    throw new common_1.HttpException({
                        message: 'Ada payslip yang sudah pernah di cetak.',
                        data: {
                            payslips: findDuplicate_1.findDuplicate(dto.bulk),
                        },
                    }, 409);
                }
                let queryBuilder = yield this.repo.createQueryBuilder('payslips');
                for (const data of dto.bulk) {
                    queryBuilder = yield queryBuilder.orWhere(`employee_id = :employee_id AND DATE(start_at) <= :start_at AND DATE(end_at) >= :end_at`, Object.assign({}, data));
                }
                const isPayslipExists = yield queryBuilder.getMany();
                if (isPayslipExists.length === 0) {
                    const res = {
                        payslips: [],
                        loans: [],
                    };
                    yield typeorm_2.getConnection().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                        for (const data of dto.bulk) {
                            const tmpData = Object.assign({}, data);
                            const tmpDataPayslipCreated = yield this.repo.create(data);
                            const tmpDataPayslipSaved = yield transactionalEntityManager.save(tmpDataPayslipCreated);
                            res.payslips.push(tmpDataPayslipSaved);
                            const latestLoanPay = yield this.loanRepo.findOne({
                                where: {
                                    employee_id: data.employee_id,
                                },
                                order: {
                                    created_at: 'DESC',
                                },
                            });
                            let tmpDataLoan = {
                                employee_id: tmpData.employee_id,
                                created_by_id: additionalData.accountId,
                                type: loan_enum_1.ELoanType.PAY,
                                loan_date: new Date(),
                                nominal: tmpData.meta && tmpData.meta.payslip
                                    ? tmpData.meta.payslip.value_bon_deduction
                                    : 0,
                            };
                            const loanPayData = yield loanCalculator_1.calculateLoan(latestLoanPay, loan_enum_1.ELoanType.PAY, tmpDataLoan.nominal);
                            tmpDataLoan = Object.assign(Object.assign({}, tmpDataLoan), loanPayData);
                            if (tmpDataLoan.nominal > 0) {
                                const tmpDataLoanCreated = yield this.loanRepo.create(tmpDataLoan);
                                const tmpDataLoanSaved = yield transactionalEntityManager.save(tmpDataLoanCreated);
                                res.loans.push(tmpDataLoanSaved);
                            }
                        }
                    }));
                    return res;
                }
                else {
                    throw new common_1.HttpException({
                        message: 'Ada payslip yang sudah pernah di generate.',
                        data: {
                            payslips: isPayslipExists,
                        },
                    }, 409);
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    customUpdateMany(dto, additionalData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let queryBuilder = yield this.repo.createQueryBuilder('payslips');
                for (const data of dto.bulk) {
                    queryBuilder = yield queryBuilder.orWhere(`id = :id`, Object.assign({}, data));
                }
                const isPayslipExists = yield queryBuilder.getMany();
                if (isPayslipExists.length > 0) {
                    const res = {
                        payslips: [],
                        loans: [],
                    };
                    yield typeorm_2.getConnection().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                        for (const data of dto.bulk) {
                            const tmpData = Object.assign({}, data);
                            const payslipData = new paySlip_entity_1.PaySlip();
                            payslipData.id = data.id;
                            payslipData.start_at = data.start_at;
                            payslipData.end_at = data.end_at;
                            const newMeta = Object.assign(Object.assign({}, data.payslip_meta), { owner_payslip: data.owner_payslip });
                            payslipData.payslip_meta = newMeta;
                            const tmpDataPayslipSaved = yield transactionalEntityManager.save(payslipData);
                            res.payslips.push(tmpDataPayslipSaved);
                            const latestLoanPay = yield this.loanRepo.findOne({
                                where: {
                                    employee_id: data.employee_id,
                                },
                                order: {
                                    created_at: 'DESC',
                                },
                            });
                            let tmpDataLoan = {
                                employee_id: tmpData.employee_id,
                                created_by_id: additionalData.accountId,
                                type: loan_enum_1.ELoanType.PAY,
                                loan_date: new Date(),
                                nominal: tmpData.meta
                                    ? tmpData.meta.payslip.value_bon_deduction
                                    : 0,
                            };
                            const loanPayData = yield loanCalculator_1.calculateLoan(latestLoanPay, loan_enum_1.ELoanType.PAY, tmpDataLoan.nominal);
                            tmpDataLoan = Object.assign(Object.assign({}, tmpDataLoan), loanPayData);
                            if (tmpDataLoan.nominal > 0) {
                                const tmpDataLoanCreated = yield this.loanRepo.create(tmpDataLoan);
                                const tmpDataLoanSaved = yield transactionalEntityManager.save(tmpDataLoanCreated);
                                res.loans.push(tmpDataLoanSaved);
                            }
                        }
                    }));
                    return res;
                }
                else {
                    throw new common_1.HttpException({
                        message: 'Ada payslip yang sudah pernah di generate.',
                        data: {
                            payslips: isPayslipExists,
                        },
                    }, 409);
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    customUpdateOne(req, dto, additionalData) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne },
            updateOne: { get: () => super.updateOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
            const oldData = yield _super.findOne.call(this, filterId.value);
            const res = yield _super.updateOne.call(this, req, dto);
            const newData = yield _super.findOne.call(this, filterId.value);
            const changeDetail = yield this.getChangeDetail(oldData, newData);
            if (changeDetail.isAnyChange) {
                yield this.logService.create({
                    entity: constants_1.ENTITIES.payslip,
                    action: 'UPDATE',
                    account_id: additionalData.accountId,
                    meta: {
                        previous_data: changeDetail.oldData,
                        current_data: changeDetail.newData,
                    },
                });
            }
            return res;
        });
    }
    customReplaceOne(req, dto, additionalData) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne },
            replaceOne: { get: () => super.replaceOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
            const oldData = yield _super.findOne.call(this, filterId.value);
            const res = yield _super.replaceOne.call(this, req, dto);
            const newData = yield _super.findOne.call(this, filterId.value);
            const changeDetail = yield this.getChangeDetail(oldData, newData);
            if (changeDetail.isAnyChange) {
                yield this.logService.create({
                    entity: constants_1.ENTITIES.payslip,
                    action: 'UPDATE',
                    account_id: additionalData.accountId,
                    meta: {
                        previous_data: changeDetail.oldData,
                        current_data: changeDetail.newData,
                    },
                });
            }
            return res;
        });
    }
    customDeleteOne(req, additionalData) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne },
            deleteOne: { get: () => super.deleteOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
            const oldData = yield _super.findOne.call(this, filterId.value);
            const res = yield _super.deleteOne.call(this, req);
            yield this.logService.create({
                entity: constants_1.ENTITIES.payslip,
                action: 'DELETE',
                account_id: additionalData.accountId,
                meta: {
                    previous_data: oldData,
                    current_data: null,
                },
            });
            return res;
        });
    }
    getChangeDetail(oldData, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            let isAnyChange = false;
            if (oldData.meta && newData.meta) {
                const keys = yield Object.keys(oldData.meta.payslip);
                for (const key of keys) {
                    if (typeof oldData.payslip_meta[key] === 'object') {
                        const metaKeys = yield Object.keys(oldData.payslip_meta[key]);
                        for (const metaKey of metaKeys) {
                            if (oldData.payslip_meta[key][metaKey] !==
                                newData.payslip_meta[key][metaKey]) {
                                isAnyChange = true;
                            }
                        }
                    }
                    else if (oldData.payslip_meta[key] !== newData.payslip_meta[key]) {
                        isAnyChange = true;
                    }
                }
            }
            return {
                isAnyChange,
                oldData,
                newData,
            };
        });
    }
    getTotalOvertime(datePrams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilderCurrent = yield this.repo
                    .createQueryBuilder('payslips')
                    .select(`SUM(payslips.payslip_meta ->> '$.attendance_calculation.tambahan_lembur')`, 'overtime_total')
                    .addSelect(`payslips.employee_meta ->> '$.department.id' `, 'department_id')
                    .where('start_at >= :startAt AND end_at <= :endAt', {
                    startAt: datePrams.start_at,
                    endAt: datePrams.end_at,
                })
                    .groupBy(`payslips.employee_meta ->> '$.department.id'`);
                return yield queryBuilderCurrent.execute();
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    getTotalOvertimeCustom(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dateStart = params.filter[0].split('||')[2];
                const dateEnd = params.filter[1].split('||')[2];
                const queryBuilderCurrent = this.repo
                    .createQueryBuilder('payslips')
                    .select(`SUM(payslips.payslip_meta ->> '$.attendance_calculation.tambahan_lembur')`, 'overtime_total')
                    .addSelect(`payslips.employee_meta ->> '$.department.id' `, 'department_id')
                    .where('start_at >= :startAt AND end_at <= :endAt', {
                    startAt: dateStart,
                    endAt: dateEnd,
                })
                    .groupBy(`payslips.employee_meta ->> '$.department.id'`);
                return yield queryBuilderCurrent.execute();
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    getReportOvertimeEmployee(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dateStart = '';
                let dateEnd = '';
                let departmentValue = '';
                let employeeValue = '';
                params.filter.forEach((el) => {
                    const split = el.split('||');
                    if (split.length === 3) {
                        if (split[0] === 'start_at') {
                            dateStart = split[2];
                        }
                        else if (split[0] === 'end_at') {
                            dateEnd = split[2];
                        }
                        else if (split[0] === 'employee.department_id') {
                            departmentValue = split[2];
                        }
                        else if (split[0] === 'employee.name') {
                            employeeValue = split[2];
                        }
                    }
                });
                const limit = Number(params.per_page);
                const offset = Number(params.page) - 1;
                const page = Number(params.page);
                let queryBuilder = yield this.repo.createQueryBuilder('payslips');
                queryBuilder = queryBuilder
                    .select('*')
                    .andWhere('start_at >= :startAt AND end_at <= :endAt', {
                    startAt: dateStart,
                    endAt: dateEnd,
                });
                if (departmentValue !== '') {
                    queryBuilder = queryBuilder.andWhere(`payslips.employee_meta ->> '$.department.id' = '${departmentValue}'`);
                }
                if (employeeValue !== '') {
                    queryBuilder = queryBuilder.andWhere(`payslips.employee_meta ->> '$.name' LIKE '%${employeeValue}%'`);
                }
                queryBuilder = queryBuilder.limit(limit).offset(offset);
                const result = yield queryBuilder.getRawMany();
                const total = yield queryBuilder.getCount();
                if (total > 0) {
                    const returnFormat = {
                        data: [],
                        count: limit,
                        total,
                        page,
                        pageCount: Math.ceil(total / limit),
                    };
                    return Object.assign(Object.assign({}, returnFormat), { data: result });
                }
                else {
                    return {
                        count: 0,
                        data: [],
                        page: 1,
                        total: 0,
                    };
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    getTotalOvertimeReport(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dateStart = '';
                let dateEnd = '';
                let departmentValue = '';
                let firstDayOfMonth = '';
                let lastDayOfMonth = '';
                params.filter.forEach((el) => {
                    const split = el.split('||');
                    if (split.length === 3) {
                        if (split[0] === 'start_at') {
                            dateStart = split[2];
                        }
                        else if (split[0] === 'end_at') {
                            dateEnd = split[2];
                        }
                        else if (split[0] === 'employee.department_id') {
                            departmentValue = split[2];
                        }
                        else if (split[0] === 'start') {
                            firstDayOfMonth = split[2];
                        }
                        else if (split[0] === 'end') {
                            lastDayOfMonth = split[2];
                        }
                    }
                });
                let queryBuilder = this.repo.createQueryBuilder('payslips');
                queryBuilder = queryBuilder
                    .select(`payslips.employee_meta ->> '$.name'`, 'name')
                    .addSelect(`payslips.employee_meta ->> '$.department.id'`, 'department_id')
                    .addSelect(`payslips.employee_meta ->> '$.department.name'`, 'department_name')
                    .addSelect(`payslips.employee_meta ->> '$.area.name'`, 'area')
                    .addSelect(`payslips.employee_meta ->> '$.area.name'`, 'nik')
                    .addSelect(`payslips.employee_meta ->> '$.position.name'`, 'position')
                    .addSelect('payslips.payslip_meta', 'payslip_meta')
                    .addSelect('payslips.start_at', 'start_at')
                    .addSelect('payslips.end_at', 'end_at')
                    .addSelect(`payslips.payslip_meta ->> '$.rewards.durasi_lembur'`, 'overtime_duration')
                    .andWhere('start_at >= :startAt AND end_at <= :endAt', {
                    startAt: dateStart,
                    endAt: dateEnd,
                })
                    .andWhere(`payslips.employee_meta ->> '$.department.meta.payslip_filter' = 1`);
                if (departmentValue !== '') {
                    queryBuilder = queryBuilder.andWhere(`payslips.employee_meta ->> '$.department.id' = '${departmentValue}'`);
                }
                const result = yield queryBuilder.getRawMany();
                const res = yield this.convertOvertimePayslipWeekly(result, firstDayOfMonth, lastDayOfMonth, 'dashboard');
                const total = res.reduce((sum, { total_per_department }) => sum + total_per_department, 0);
                return {
                    total,
                    start_at: firstDayOfMonth,
                    end_at: lastDayOfMonth,
                };
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    getOvertimeReport(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dateStart = '';
                let dateEnd = '';
                let departmentValue = '';
                let firstDayOfMonth = '';
                let lastDayOfMonth = '';
                params.filter.forEach((el) => {
                    const split = el.split('||');
                    if (split.length === 3) {
                        if (split[0] === 'start_at') {
                            dateStart = split[2];
                        }
                        else if (split[0] === 'end_at') {
                            dateEnd = split[2];
                        }
                        else if (split[0] === 'employee.department_id') {
                            departmentValue = split[2];
                        }
                        else if (split[0] === 'start') {
                            firstDayOfMonth = split[2];
                        }
                        else if (split[0] === 'end') {
                            lastDayOfMonth = split[2];
                        }
                    }
                });
                const limit = Number(params.per_page);
                const offset = Number(params.page) - 1;
                const page = Number(params.page);
                let queryBuilder = this.repo.createQueryBuilder('payslips');
                queryBuilder = queryBuilder
                    .select(`payslips.employee_meta ->> '$.name'`, 'name')
                    .addSelect(`payslips.employee_meta ->> '$.department.id'`, 'department_id')
                    .addSelect(`payslips.employee_meta ->> '$.department.name'`, 'department_name')
                    .addSelect(`payslips.employee_meta ->> '$.area.name'`, 'area')
                    .addSelect(`payslips.employee_meta ->> '$.area.name'`, 'nik')
                    .addSelect(`payslips.employee_meta ->> '$.position.name'`, 'position')
                    .addSelect('payslips.payslip_meta', 'payslip_meta')
                    .addSelect('payslips.start_at', 'start_at')
                    .addSelect('payslips.end_at', 'end_at')
                    .addSelect(`payslips.payslip_meta ->> '$.rewards.durasi_lembur'`, 'overtime_duration')
                    .andWhere('start_at >= :startAt AND end_at <= :endAt', {
                    startAt: dateStart,
                    endAt: dateEnd,
                })
                    .andWhere(`payslips.employee_meta ->> '$.department.meta.payslip_filter' = 1`);
                if (departmentValue !== '') {
                    queryBuilder = queryBuilder.andWhere(`payslips.employee_meta ->> '$.department.id' = '${departmentValue}'`);
                }
                const result = yield queryBuilder.getRawMany();
                const total = yield queryBuilder.getCount();
                const res = yield this.convertOvertimePayslipWeekly(result, firstDayOfMonth, lastDayOfMonth, 'report');
                if (total > 0) {
                    const returnFormat = {
                        data: [],
                        count: limit,
                        total,
                        page,
                        pageCount: Math.ceil(total / limit),
                    };
                    return Object.assign(Object.assign({}, returnFormat), { data: res });
                }
                else {
                    return {
                        count: 0,
                        data: [],
                        page: 1,
                        total: 0,
                    };
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    convertOvertimePayslipWeekly(res, firstDayOfMonth, lastDayOfMonth, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const thisMonth = firstDayOfMonth.substring(0, 10).split('-')[1];
            const thisYears = new Date().getFullYear();
            const result = res.map((el, index) => {
                const department = {
                    name: el.department_name,
                    id: el.department_id,
                };
                const employee = {
                    name: el.name,
                    nik: el.nik,
                    position: el.position,
                    area: el.area,
                };
                const monthStart = el.start_at
                    .toISOString()
                    .substring(0, 10)
                    .split('-')[1];
                const monthEnd = el.end_at
                    .toISOString()
                    .substring(0, 10)
                    .split('-')[1];
                const overtime = [];
                let totalCost = 0;
                if (monthStart !== thisMonth) {
                    const awalTanggalMulaiBulanIni = this.firstDayOfMonth(thisYears, Number(thisMonth) - 1);
                    const awalTanggalSelesaiPeriodeIni = Number(el.end_at
                        .toISOString()
                        .substring(0, 10)
                        .split('-')[2]);
                    const rangeAwalBulan = this.createDateRange(awalTanggalMulaiBulanIni, awalTanggalSelesaiPeriodeIni, thisMonth);
                    el.payslip_meta.employee_overtimes.forEach((data) => {
                        const find = rangeAwalBulan.find((a) => {
                            return (a.date.substring(0, 10) === data.time_check_in.substring(0, 10));
                        });
                        if (find) {
                            totalCost += data.overtime_cost;
                            overtime.push({
                                date: data.time_check_in,
                                duration: data.total_overtime,
                                nominal: data.overtime_cost,
                            });
                        }
                    });
                    return {
                        department,
                        employee,
                        overtime,
                        overtime_duration: el.overtime_duration,
                        total: totalCost,
                        start_at: new Date(firstDayOfMonth).toISOString(),
                        end_at: new Date(el.end_at).toISOString(),
                        is_split: 'begining_of_month',
                    };
                }
                if (monthEnd !== thisMonth) {
                    const akhirTanggalMulaiBulanIni = Number(el.start_at
                        .toISOString()
                        .substring(0, 10)
                        .split('-')[2]);
                    const akhirTanggalSelesaiPeriodeIni = this.lastDayOfMonth(thisYears, Number(thisMonth) - 1);
                    const rangeAkhirBulan = this.createDateRange(akhirTanggalMulaiBulanIni, akhirTanggalSelesaiPeriodeIni, thisMonth);
                    el.payslip_meta.employee_overtimes.forEach((data) => {
                        const find = rangeAkhirBulan.find((a) => {
                            return (a.date.substring(0, 10) === data.time_check_in.substring(0, 10));
                        });
                        if (find) {
                            totalCost += data.overtime_cost;
                            overtime.push({
                                date: data.time_check_in,
                                duration: data.total_overtime,
                                nominal: data.overtime_cost,
                            });
                        }
                    });
                    return {
                        department,
                        employee,
                        overtime,
                        total: totalCost,
                        overtime_duration: el.overtime_duration,
                        start_at: new Date(el.start_at).toISOString(),
                        end_at: new Date(lastDayOfMonth).toISOString(),
                        is_split: 'end_of_month',
                    };
                }
                el.payslip_meta.employee_overtimes.forEach((data) => {
                    totalCost += data.overtime_cost;
                    overtime.push({
                        date: data.time_check_in,
                        duration: data.total_overtime,
                        nominal: data.overtime_cost,
                    });
                });
                return {
                    department,
                    employee,
                    overtime,
                    total: totalCost,
                    overtime_duration: el.overtime_duration,
                    start_at: new Date(el.start_at).toISOString(),
                    end_at: new Date(el.end_at).toISOString(),
                    is_split: 'none',
                };
            });
            if (type === 'report') {
                const groupPerDepartment = yield this.groupingOvertimeDataByDepartment(result);
                const endResult = yield groupPerDepartment.map(el => {
                    const data = this.groupingOutcomeDataByPeriode(el.data);
                    return Object.assign(Object.assign({}, el), { data });
                });
                return endResult;
            }
            else if (type === 'dashboard') {
                return yield this.groupingOvertimeDataByDepartment(result);
            }
        });
    }
    groupingOvertimeDataByDepartment(arr) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupDepartment = yield arr.reduce((acc, d) => {
                const found = acc.find(a => {
                    return a.department.id === d.department.id;
                });
                const value = {
                    total: Number(d.total),
                    employee_name: d.employee.name,
                    overtime_duration: d.overtime_duration,
                    start_at: d.start_at,
                    end_at: d.end_at,
                    department_id: d.department.id,
                    department: d.department.name,
                    area: d.employee.area,
                    position: d.employee.position,
                    group: d.employee.group,
                    nik: d.employee.nik,
                    is_split: d.is_split,
                    id: uuid.v4(),
                };
                if (!found) {
                    acc.push({
                        department: {
                            id: d.department.id,
                        },
                        start_at: d.start_at,
                        end_at: d.end_at,
                        department_name: d.department.name,
                        department_id: d.department.id,
                        data: [value],
                        total_per_department: Number(d.total),
                    });
                }
                else {
                    found.total_per_department += Number(value.total);
                    found.data.push(value);
                }
                return acc;
            }, []);
            return groupDepartment;
        });
    }
    getTotalOutcomeReport(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dateStart = '';
                let dateEnd = '';
                let departmentValue = '';
                let firstDayOfMonth = '';
                let lastDayOfMonth = '';
                params.filter.forEach((el) => {
                    const split = el.split('||');
                    if (split.length === 3) {
                        if (split[0] === 'start_at') {
                            dateStart = split[2];
                        }
                        else if (split[0] === 'end_at') {
                            dateEnd = split[2];
                        }
                        else if (split[0] === 'employee.department_id') {
                            departmentValue = split[2];
                        }
                        else if (split[0] === 'start') {
                            firstDayOfMonth = split[2];
                        }
                        else if (split[0] === 'end') {
                            lastDayOfMonth = split[2];
                        }
                    }
                });
                let queryBuilder = this.repo.createQueryBuilder('payslips');
                queryBuilder = queryBuilder
                    .select('*')
                    .andWhere('start_at >= :startAt AND end_at <= :endAt', {
                    startAt: dateStart,
                    endAt: dateEnd,
                });
                const result = yield queryBuilder.getRawMany();
                const res = yield this.convertOutcomePayslips(result, firstDayOfMonth, lastDayOfMonth, 'dashboard');
                const total = res.reduce((sum, { total_per_department }) => sum + total_per_department, 0);
                return {
                    total,
                    start_at: firstDayOfMonth,
                    end_at: lastDayOfMonth,
                };
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    getOutcomeReport(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dateStart = '';
                let dateEnd = '';
                let departmentValue = '';
                let firstDayOfMonth = '';
                let lastDayOfMonth = '';
                params.filter.forEach((el) => {
                    const split = el.split('||');
                    if (split.length === 3) {
                        if (split[0] === 'start_at') {
                            dateStart = split[2];
                        }
                        else if (split[0] === 'end_at') {
                            dateEnd = split[2];
                        }
                        else if (split[0] === 'employee.department_id') {
                            departmentValue = split[2];
                        }
                        else if (split[0] === 'start') {
                            firstDayOfMonth = split[2];
                        }
                        else if (split[0] === 'end') {
                            lastDayOfMonth = split[2];
                        }
                    }
                });
                const limit = Number(params.per_page);
                const offset = Number(params.page) - 1;
                const page = Number(params.page);
                let queryBuilder = this.repo.createQueryBuilder('payslips');
                queryBuilder = queryBuilder
                    .select('*')
                    .andWhere('start_at >= :startAt AND end_at <= :endAt', {
                    startAt: dateStart,
                    endAt: dateEnd,
                });
                if (departmentValue !== '') {
                    queryBuilder = queryBuilder.andWhere(`payslips.employee_meta ->> '$.department.id' = '${departmentValue}'`);
                }
                const result = yield queryBuilder.getRawMany();
                const total = yield queryBuilder.getCount();
                const res = yield this.convertOutcomePayslips(result, firstDayOfMonth, lastDayOfMonth, 'report');
                if (total > 0) {
                    const returnFormat = {
                        data: [],
                        count: limit,
                        total,
                        page,
                        pageCount: Math.ceil(total / limit),
                    };
                    return Object.assign(Object.assign({}, returnFormat), { data: res });
                }
                else {
                    return {
                        count: 0,
                        data: [],
                        page: 1,
                        total: 0,
                    };
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    convertOutcomePayslips(res, firstDayOfMonth, lastDayOfMonth, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const thisMonth = firstDayOfMonth.substring(0, 10).split('-')[1];
            const thisYears = new Date().getFullYear();
            const result = res.map((el, index) => {
                const monthStart = el.start_at
                    .toISOString()
                    .substring(0, 10)
                    .split('-')[1];
                const monthEnd = el.end_at
                    .toISOString()
                    .substring(0, 10)
                    .split('-')[1];
                const gajiHarian = el.total / el.employee_meta.attendances.length;
                if (monthStart !== thisMonth) {
                    let awalGajiSesuaiPresensi = 0;
                    const awalTanggalMulaiBulanIni = this.firstDayOfMonth(thisYears, Number(thisMonth) - 1);
                    const awalTanggalSelesaiPeriodeIni = Number(el.end_at
                        .toISOString()
                        .substring(0, 10)
                        .split('-')[2]);
                    const rangeAwalBulan = this.createDateRange(awalTanggalMulaiBulanIni, awalTanggalSelesaiPeriodeIni, thisMonth);
                    el.employee_meta.attendances.forEach((data) => {
                        const find = rangeAwalBulan.find((a) => {
                            return a.date.substring(0, 10) === data.date.substring(0, 10);
                        });
                        if (find) {
                            awalGajiSesuaiPresensi += gajiHarian;
                        }
                    });
                    return Object.assign(Object.assign({}, el), { total: awalGajiSesuaiPresensi, start_at: new Date(firstDayOfMonth).toISOString(), end_at: new Date(el.end_at).toISOString(), is_split: 'begining_of_month' });
                }
                if (monthEnd !== thisMonth) {
                    let akhirGajiSesuaiPresensi = 0;
                    const akhirTanggalMulaiBulanIni = Number(el.start_at
                        .toISOString()
                        .substring(0, 10)
                        .split('-')[2]);
                    const akhirTanggalSelesaiPeriodeIni = this.lastDayOfMonth(thisYears, Number(thisMonth) - 1);
                    const rangeAkhirBulan = this.createDateRange(akhirTanggalMulaiBulanIni, akhirTanggalSelesaiPeriodeIni, thisMonth);
                    el.employee_meta.attendances.forEach((data) => {
                        const find = rangeAkhirBulan.find((a) => {
                            return a.date.substring(0, 10) === data.date.substring(0, 10);
                        });
                        if (find) {
                            akhirGajiSesuaiPresensi += gajiHarian;
                        }
                    });
                    return Object.assign(Object.assign({}, el), { total: akhirGajiSesuaiPresensi, start_at: new Date(el.start_at).toISOString(), end_at: new Date(lastDayOfMonth).toISOString(), is_split: 'end_of_month' });
                }
                return Object.assign(Object.assign({}, el), { is_split: 'none' });
            });
            if (type === 'report') {
                const groupPerDepartment = yield this.groupingOutcomeDataByDepartment(result);
                const endResult = yield groupPerDepartment.map(el => {
                    const data = this.groupingOutcomeDataByPeriode(el.data);
                    return Object.assign(Object.assign({}, el), { data });
                });
                return endResult;
            }
            else if (type === 'dashboard') {
                return yield this.groupingOutcomeDataByDepartment(result);
            }
        });
    }
    groupingOutcomeDataByDepartment(arr) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupDepartment = yield arr.reduce((acc, d) => {
                const found = acc.find(a => {
                    return a.employee_meta.department_id === d.employee_meta.department_id;
                });
                const value = {
                    total: Number(d.total),
                    employee_name: d.employee_meta.name,
                    start_at: d.start_at,
                    end_at: d.end_at,
                    department_id: d.employee_meta.department_id,
                    department: d.employee_meta.department.name,
                    area: d.employee_meta.area.name,
                    position: d.employee_meta.position.name,
                    group: d.employee_meta.group.name,
                    nik: d.employee_meta.nik,
                    is_split: d.is_split,
                    id: uuid.v4(),
                };
                if (!found) {
                    acc.push({
                        employee_meta: {
                            department_id: d.employee_meta.department_id,
                        },
                        start_at: d.start_at,
                        end_at: d.end_at,
                        department_name: d.employee_meta.department.name,
                        department_id: d.employee_meta.department.id,
                        data: [value],
                        total_per_department: Number(d.total),
                    });
                }
                else {
                    found.total_per_department += Number(value.total);
                    found.data.push(value);
                }
                return acc;
            }, []);
            return groupDepartment;
        });
    }
    groupingOutcomeDataByPeriode(arr) {
        const groupDepartmentDate = arr.reduce((acc, d) => {
            const found = acc.find(a => {
                return (new Date(a.start_at).toISOString() ===
                    new Date(d.start_at).toISOString());
            });
            const value = {
                total: Number(d.total),
                name: d.employee_name,
                department: d.department,
                group: d.group,
                position: d.position,
                area: d.area,
                nik: d.nik,
                overtime_duration: d.overtime_duration || 0,
            };
            if (!found) {
                acc.push({
                    id: d.id,
                    department: d.department,
                    department_id: d.department_id,
                    start_at: d.start_at,
                    end_at: d.end_at,
                    data: [value],
                    total_per_periode: Number(d.total),
                    total_employee: 1,
                    is_split: d.is_split,
                });
            }
            else {
                found.total_per_periode += Number(value.total);
                found.total_employee += 1;
                found.data.push(value);
            }
            return acc;
        }, []);
        return groupDepartmentDate;
    }
    createDateRange(start, end, month) {
        const year = new Date().getFullYear();
        const data = [];
        for (let i = start; i <= end; i++) {
            const date = year + '-' + month + '-' + (i < 10 ? '0' + i : i) + ' 00:00:00';
            data.push({
                date,
                nominal: 0,
            });
        }
        return data;
    }
    lastDayOfMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    firstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDate();
    }
};
PaySlipService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(paySlip_entity_1.PaySlip)),
    __param(1, typeorm_1.InjectRepository(loan_entity_1.Loan)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        log_service_1.LogService])
], PaySlipService);
exports.PaySlipService = PaySlipService;
//# sourceMappingURL=paySlip.service.js.map