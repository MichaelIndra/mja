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
const loan_entity_1 = require("./loan.entity");
const log_service_1 = require("../log/log.service");
const constants_1 = require("../utils/constants");
const loan_enum_1 = require("./loan.enum");
const loanCalculator_1 = require("../utils/loanCalculator");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("../employee/employee.entity");
let LoanService = class LoanService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo, employeeRepository, logService) {
        super(repo);
        this.employeeRepository = employeeRepository;
        this.logService = logService;
    }
    customCreateOne(req, dto, additionalData) {
        const _super = Object.create(null, {
            createOne: { get: () => super.createOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const latestLoanPay = yield this.repo.findOne({
                    where: {
                        employee_id: dto.employee_id,
                    },
                    order: {
                        created_at: 'DESC',
                    },
                });
                const loanPayData = yield loanCalculator_1.calculateLoan(latestLoanPay, dto.type, dto.nominal);
                if (loanPayData) {
                    const newDto = Object.assign(Object.assign(Object.assign({}, dto), loanPayData), { create_by_id: additionalData.accountId });
                    const res = yield _super.createOne.call(this, req, newDto);
                    return res;
                }
                else {
                    return Promise.reject({
                        statusCode: 400,
                        message: 'Nominal must be more than 0',
                    });
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
            const keys = Object.keys(oldData);
            for (const key of keys) {
                if (oldData[key] !== newData[key]) {
                    isAnyChange = true;
                }
            }
            return {
                isAnyChange,
                oldData,
                newData,
            };
        });
    }
    getCurrentLoanDetail(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = yield this.repo
                    .createQueryBuilder('loans')
                    .addSelect('id')
                    .addSelect('employee_id')
                    .addSelect('type')
                    .addSelect('SUM(loans.nominal)', 'sum_nominal')
                    .where('employee_id = :employeeId ', { employeeId })
                    .addGroupBy('employee_id')
                    .addGroupBy('type');
                const results = yield queryBuilder.getRawMany();
                const res = {
                    total_loan: 0,
                    total_paid: 0,
                    current_loan: 0,
                };
                for (const data of results) {
                    if (data.type === loan_enum_1.ELoanType.LOAN) {
                        res.total_loan = Number(data.sum_nominal);
                    }
                    else if (data.type === loan_enum_1.ELoanType.PAY) {
                        res.total_paid = Number(data.sum_nominal);
                    }
                }
                res.current_loan = res.total_loan - res.total_paid;
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    getTotalLoanByDepartment() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = yield this.employeeRepository.createQueryBuilder('employees');
                const realQuery = queryBuilder
                    .select('sum((' +
                    queryBuilder
                        .subQuery()
                        .select('loans.total_loan_current')
                        .from(loan_entity_1.Loan, 'loans')
                        .where('loans.employee_id = employees.id')
                        .orderBy('loans.loan_date', 'DESC')
                        .limit(1)
                        .getQuery() +
                    ') )', 'total_loan')
                    .addSelect('departments.name')
                    .leftJoin('employees.department', 'departments')
                    .groupBy('departments.name');
                return yield realQuery.getRawMany();
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
LoanService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(loan_entity_1.Loan)),
    __param(1, typeorm_1.InjectRepository(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        log_service_1.LogService])
], LoanService);
exports.LoanService = LoanService;
//# sourceMappingURL=loan.service.js.map