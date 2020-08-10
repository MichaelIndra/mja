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
const outcome_entity_1 = require("./outcome.entity");
const department_entity_1 = require("../department/department.entity");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("../employee/employee.entity");
let OutcomeService = class OutcomeService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo, departmentService, employeeService) {
        super(repo);
        this.departmentService = departmentService;
        this.employeeService = employeeService;
    }
    customCreateOutcome(dto, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = {};
                const endAt = new Date(dto.end_at + ' 23:59:59').toISOString();
                const outcomeData = yield this.repo
                    .createQueryBuilder('Outcome')
                    .where(`department_id = '${dto.department_id}'`)
                    .andWhere(`start_at >= '${dto.start_at}'`)
                    .andWhere(`end_at <= '${endAt}'`)
                    .getOne();
                if (outcomeData) {
                    let newNominal = outcomeData.nominal_per_period || 0;
                    if (userRole === 'owner') {
                        dto.employee_payslip.forEach((el) => {
                            newNominal += el.tambahan_owner;
                            outcomeData.employee_payslip.push(Object.assign(Object.assign({}, el), { total_pendapatan: el.tambahan_buku_2, total_potongan: el.potongan_buku_2, from_owner: true }));
                        });
                    }
                    else {
                        dto.employee_payslip.forEach((el) => {
                            newNominal += el.pendapatan_gaji;
                            outcomeData.employee_payslip.push(el);
                        });
                    }
                    const newOutcomeData = Object.assign(Object.assign({}, outcomeData), { nominal_per_period: newNominal });
                    console.info('supremacy', newOutcomeData);
                    result = yield this.repo.save(newOutcomeData);
                }
                else {
                    const newDto = Object.assign(Object.assign({}, dto), { end_at: new Date(dto.end_at).toISOString() });
                    const newOutcome = yield this.repo.create(newDto);
                    result = yield this.repo.save(newOutcome);
                }
                return result;
            }
            catch (error) {
                throw new common_1.HttpException({
                    message: 'Error, when try get data outcomes.',
                    data: {},
                }, 500);
            }
        });
    }
    getOutcomePerDepartment(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let start_at = '';
                let end_at = '';
                if (query.filter && query.filter.length > 0) {
                    query.filter.forEach((el) => {
                        const split = el.split('||');
                        if (split[0] === 'start_at') {
                            start_at = split[2];
                        }
                        if (split[0] === 'end_at') {
                            end_at = split[2];
                        }
                    });
                }
                const queryBuilder = this.departmentService.createQueryBuilder('departments');
                const outcomeTotal = queryBuilder
                    .select('departments.name', 'department_name')
                    .addSelect(queryBuilder
                    .subQuery()
                    .select('sum(outcomes.nominal_per_period)', 'total')
                    .from(outcome_entity_1.Outcome, 'outcomes')
                    .where('outcomes.department_id = departments.id')
                    .andWhere(`outcomes.start_at >= '${start_at}'`)
                    .andWhere(`outcomes.end_at <= '${end_at}'`)
                    .groupBy('outcomes.department_id')
                    .getQuery(), 'total');
                console.info('getOutcomePerDepartment', outcomeTotal.getSql());
                return outcomeTotal.getRawMany();
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
OutcomeService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(outcome_entity_1.Outcome)),
    __param(1, typeorm_1.InjectRepository(department_entity_1.Department)),
    __param(2, typeorm_1.InjectRepository(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository])
], OutcomeService);
exports.OutcomeService = OutcomeService;
//# sourceMappingURL=outcome.service.js.map