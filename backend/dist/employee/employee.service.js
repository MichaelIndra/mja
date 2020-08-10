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
const employee_entity_1 = require("./employee.entity");
const typeorm_2 = require("typeorm");
const log_service_1 = require("../log/log.service");
const constants_1 = require("../utils/constants");
const department_service_1 = require("../department/department.service");
const group_service_1 = require("../department/group/group.service");
const area_service_1 = require("../department/area/area.service");
const position_service_1 = require("../department/area/position/position.service");
const log_entity_1 = require("../log/log.entity");
const loan_entity_1 = require("../loan/loan.entity");
let EmployeeService = class EmployeeService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo, loanRepo, logService, departmentService, groupService, areaService, positionService) {
        super(repo);
        this.loanRepo = loanRepo;
        this.logService = logService;
        this.departmentService = departmentService;
        this.groupService = groupService;
        this.areaService = areaService;
        this.positionService = positionService;
    }
    findByNiks(niks) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (niks.length === 0) {
                    return Promise.reject({
                        statusCode: 400,
                        message: 'NIK must be an array of string',
                    });
                }
                const res = yield this.repo.find({
                    where: { nik: typeorm_2.In(niks) },
                    relations: ['group', 'group.department', 'position', 'area'],
                });
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    findByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (ids.length === 0) {
                    return Promise.reject({
                        statusCode: 400,
                        message: 'ID must be an array of string',
                    });
                }
                const res = yield this.repo.find({
                    id: typeorm_2.In(ids),
                });
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    customGetOne(req) {
        const _super = Object.create(null, {
            getOne: { get: () => super.getOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isJoinLoans = yield req.parsed.join.find(item => item.field.includes('loan'));
                let res = yield _super.getOne.call(this, req);
                if (isJoinLoans) {
                    const latestLoan = yield this.loanRepo.findOne({
                        where: {
                            employee_id: res.id,
                        },
                        order: {
                            created_at: 'DESC',
                        },
                    });
                    res = Object.assign(Object.assign({}, res), { latestLoan });
                }
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    customGetMany(req) {
        const _super = Object.create(null, {
            getMany: { get: () => super.getMany }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isJoinLoans = yield req.parsed.join.find(item => item.field.includes('loan'));
                let res = yield _super.getMany.call(this, req);
                let resData = [];
                if (Array.isArray(res)) {
                    resData = res;
                }
                else if (Array.isArray(res.data)) {
                    resData = res.data;
                }
                if (isJoinLoans) {
                    for (const idx in resData) {
                        if (resData[idx]) {
                            const latestLoan = yield this.loanRepo.findOne({
                                where: {
                                    employee_id: resData[idx].id,
                                },
                                order: {
                                    created_at: 'DESC',
                                },
                            });
                            resData[idx] = Object.assign(Object.assign({}, resData[idx]), { latestLoan });
                        }
                    }
                }
                if (Array.isArray(res)) {
                    res = resData;
                }
                else if (Array.isArray(res.data)) {
                    res = Object.assign(Object.assign({}, res), { data: res.data });
                }
                return res;
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
            try {
                const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
                const oldData = yield _super.findOne.call(this, filterId.value);
                const res = yield _super.updateOne.call(this, req, dto);
                const newData = yield _super.findOne.call(this, filterId.value);
                const changeDetail = yield this.getChangeDetail(oldData, newData);
                if (changeDetail.isAnyChange) {
                    yield this.logService.create({
                        entity: constants_1.ENTITIES.employee,
                        action: 'UPDATE',
                        account_id: additionalData.accountId,
                        meta: {
                            previous_data: changeDetail.oldData,
                            current_data: changeDetail.newData,
                        },
                    });
                }
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    customReplaceOne(req, dto, additionalData) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne },
            replaceOne: { get: () => super.replaceOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
                const oldData = yield _super.findOne.call(this, filterId.value);
                const res = yield _super.replaceOne.call(this, req, dto);
                const newData = yield _super.findOne.call(this, filterId.value);
                const changeDetail = yield this.getChangeDetail(oldData, newData);
                if (changeDetail.isAnyChange) {
                    yield this.logService.create({
                        entity: constants_1.ENTITIES.employee,
                        action: 'UPDATE',
                        account_id: additionalData.accountId,
                        meta: {
                            previous_data: changeDetail.oldData,
                            current_data: changeDetail.newData,
                        },
                    });
                }
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    customDeleteOne(req, additionalData) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne },
            deleteOne: { get: () => super.deleteOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
                const oldData = yield _super.findOne.call(this, filterId.value);
                const res = yield _super.deleteOne.call(this, req);
                yield this.logService.create({
                    entity: constants_1.ENTITIES.employee,
                    action: 'DELETE',
                    account_id: additionalData.accountId,
                    meta: {
                        previous_data: oldData,
                        current_data: null,
                    },
                });
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    getChangeDetail(oldData, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let isAnyChange = false;
                if (oldData.department_id !== newData.department_id) {
                    isAnyChange = true;
                    let department = yield this.departmentService.findOne(oldData.department_id);
                    oldData = Object.assign(Object.assign({}, oldData), { department_data: department });
                    department = yield this.departmentService.findOne(newData.department_id);
                    newData = Object.assign(Object.assign({}, newData), { department_data: department });
                }
                if (oldData.group_id !== newData.group_id) {
                    isAnyChange = true;
                    let group = yield this.groupService.findOne(oldData.group_id);
                    oldData = Object.assign(Object.assign({}, oldData), { group_data: group });
                    group = yield this.groupService.findOne(newData.group_id);
                    newData = Object.assign(Object.assign({}, newData), { group_data: group });
                }
                if (oldData.area_id !== newData.area_id) {
                    isAnyChange = true;
                    let area = yield this.areaService.findOne(oldData.area_id);
                    oldData = Object.assign(Object.assign({}, oldData), { area_data: area });
                    area = yield this.areaService.findOne(newData.area_id);
                    newData = Object.assign(Object.assign({}, newData), { area_data: area });
                }
                if (oldData.position_id !== newData.position_id) {
                    isAnyChange = true;
                    let position = yield this.positionService.findOne(oldData.position_id);
                    oldData = Object.assign(Object.assign({}, oldData), { position_data: position });
                    position = yield this.positionService.findOne(newData.position_id);
                    newData = Object.assign(Object.assign({}, newData), { position_data: position });
                }
                if (oldData.meta && newData.meta) {
                    const keys = yield Object.keys(oldData.meta.payslip);
                    for (const key of keys) {
                        if (oldData.meta.payslip[key] !== newData.meta.payslip[key]) {
                            isAnyChange = true;
                        }
                    }
                }
                return {
                    isAnyChange,
                    oldData,
                    newData,
                };
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    getEmployeeBirthday() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = this.repo
                    .createQueryBuilder('employees')
                    .addSelect('nik')
                    .addSelect('picture')
                    .addSelect('name')
                    .addSelect('date_of_birth')
                    .addSelect(`DATE(CONCAT(YEAR(CURDATE()),'-',SUBSTRING_INDEX(SUBSTRING_INDEX(date_of_birth,'/',-1),'-',-2)))`, 'current_birth_day')
                    .where(`DATE(CONCAT(YEAR(CURDATE()),'-',SUBSTRING_INDEX(SUBSTRING_INDEX(date_of_birth,'/',-1),'-',-2))) >= CURDATE()`)
                    .orderBy('current_birth_day', 'ASC')
                    .limit(5);
                return yield queryBuilder.getMany();
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    getEmployeeDataForPayslip(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { department_id, date_start, date_end, status } = query;
            try {
                let queryBuilder = yield this.repo
                    .createQueryBuilder('Employee')
                    .innerJoinAndSelect('Employee.department', 'departments')
                    .innerJoinAndSelect('Employee.group', 'groups')
                    .innerJoinAndSelect('Employee.area', 'areas')
                    .innerJoinAndSelect('Employee.position', 'positions')
                    .leftJoinAndSelect('Employee.attendances', 'attendances', `attendances.time_check_in >= :date_start AND attendances.time_check_out <= :date_end`, { date_start, date_end })
                    .leftJoinAndSelect('Employee.leaves', 'leaves', `leaves.date_start >= :date_start OR leaves.date_end <= :date_end`, { date_start, date_end })
                    .leftJoinAndSelect('Employee.payslips', 'Payslips', `Payslips.start_at >= :date_start AND Payslips.end_at <= :date_end`, { date_start, date_end })
                    .where(`Employee.active = true`);
                if (status !== undefined) {
                    queryBuilder = queryBuilder.andWhere('Employee.status = :status', {
                        status,
                    });
                }
                queryBuilder = queryBuilder
                    .andWhere(`Employee.department_id = :department_id`, { department_id })
                    .andWhere(`attendances.time_check_in BETWEEN :date_start AND :date_end`, { date_start, date_end })
                    .orderBy('Employee.name', 'ASC')
                    .addOrderBy('attendances.time_check_in', 'ASC');
                let res = yield queryBuilder.getMany();
                let resData = [];
                if (Array.isArray(res)) {
                    resData = res;
                }
                else if (Array.isArray(res.data)) {
                    resData = res.data;
                }
                for (const idx in resData) {
                    if (resData[idx]) {
                        const latestLoan = yield this.loanRepo.findOne({
                            where: {
                                employee_id: resData[idx].id,
                            },
                            order: {
                                created_at: 'DESC',
                            },
                        });
                        resData[idx] = Object.assign(Object.assign({}, resData[idx]), { latestLoan });
                    }
                }
                if (Array.isArray(res)) {
                    res = resData;
                }
                else if (Array.isArray(res.data)) {
                    res = Object.assign(Object.assign({}, res), { data: res.data });
                }
                if (status !== undefined && status === 'KHUSUS') {
                    res = res.filter((el) => {
                        return el.payslips && el.payslips.length > 0;
                    });
                }
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    getTotalEmployee() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = yield this.repo.createQueryBuilder('employees');
                const queryBuilderActive = yield this.repo
                    .createQueryBuilder('employees')
                    .where('active = 1');
                const totalEmployee = yield queryBuilder.getCount();
                const totalActiveEmployee = yield queryBuilderActive.getCount();
                return {
                    total_employee: totalEmployee,
                    total_active_employee: totalActiveEmployee,
                };
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    switchGroup(additionalData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listEmployee = yield this.repo
                    .createQueryBuilder('employee')
                    .select('employee.id', 'id')
                    .addSelect('employee.name', 'name')
                    .addSelect('group.switchable', 'group_switchable')
                    .addSelect('employee.group_id', 'group_id')
                    .addSelect('group.name', 'group_name')
                    .leftJoin('employee.group', 'group')
                    .where('group.switchable = 1')
                    .andWhere('employee.active = 1')
                    .getRawMany();
                const listGroup = yield this.groupService.getListSwitchable();
                const listDepartmentWithGroup = yield listGroup.reduce((acc, curr) => {
                    if (!acc[curr.department_id]) {
                        acc[curr.department_id] = {
                            department_id: curr.department_id,
                            groups: [curr],
                        };
                        return acc;
                    }
                    acc[curr.department_id].groups.push(curr);
                    return acc;
                }, {});
                for (const department_id of Object.keys(listDepartmentWithGroup)) {
                    const dataDepartment = listDepartmentWithGroup[department_id];
                    if (dataDepartment.groups.length > 0) {
                        for (const index in dataDepartment.groups) {
                            if (dataDepartment.groups[index]) {
                                let indexChanged;
                                const maxIndex = dataDepartment.groups.length - 1;
                                if (Number(index) === 0 && maxIndex === 0) {
                                    indexChanged = null;
                                }
                                else if (Number(index) + 1 <= maxIndex) {
                                    indexChanged = Number(index) + 1;
                                }
                                else if (Number(index) === maxIndex) {
                                    indexChanged = 0;
                                }
                                else {
                                    indexChanged = null;
                                }
                                if (indexChanged === null) {
                                }
                                else {
                                    const employees = listEmployee.filter((item) => item.group_id === dataDepartment.groups[index].id);
                                    listDepartmentWithGroup[department_id].groups[index] = Object.assign(Object.assign({}, dataDepartment.groups[index]), { switch_to_group: dataDepartment.groups[indexChanged], employees });
                                }
                            }
                        }
                    }
                }
                const res = {
                    changed: [],
                };
                yield typeorm_2.getConnection().transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    for (const department_id of Object.keys(listDepartmentWithGroup)) {
                        const dataDepartment = listDepartmentWithGroup[department_id];
                        if (dataDepartment.groups.length > 0) {
                            for (const dataGroup of dataDepartment.groups) {
                                if (dataGroup.switch_to_group) {
                                    for (const dataEmployee of dataGroup.employees) {
                                        yield transactionalEntityManager.update(employee_entity_1.Employee, dataEmployee.id, { group_id: dataGroup.switch_to_group.id });
                                        const tmpData = Object.assign(Object.assign({}, dataEmployee), { switch_to_group: {
                                                id: dataGroup.switch_to_group.id,
                                                name: dataGroup.switch_to_group.name,
                                                department: dataGroup.switch_to_group.department,
                                            } });
                                        res.changed.push(tmpData);
                                    }
                                }
                            }
                        }
                    }
                    const logData = {
                        entity: constants_1.ENTITIES.employee,
                        action: 'SWITCH_GROUP',
                        account_id: additionalData.accountId,
                        meta: {
                            previous_data: null,
                            current_data: null,
                            additional_data: res,
                        },
                    };
                    const logCreated = yield transactionalEntityManager.create(log_entity_1.Log, logData);
                    yield transactionalEntityManager.save(logCreated);
                }));
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
EmployeeService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(employee_entity_1.Employee)),
    __param(1, typeorm_1.InjectRepository(loan_entity_1.Loan)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        log_service_1.LogService,
        department_service_1.DepartmentService,
        group_service_1.GroupService,
        area_service_1.AreaService,
        position_service_1.PositionService])
], EmployeeService);
exports.EmployeeService = EmployeeService;
//# sourceMappingURL=employee.service.js.map