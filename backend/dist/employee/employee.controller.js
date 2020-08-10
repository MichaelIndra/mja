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
const employee_entity_1 = require("./employee.entity");
const employee_service_1 = require("./employee.service");
const crud_1 = require("@nestjsx/crud");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/role/roles.guard");
const department_service_1 = require("../department/department.service");
const auth_1 = require("../utils/auth");
const employee_dto_1 = require("./employee.dto");
const mysqldump_1 = require("mysqldump");
let EmployeeController = class EmployeeController {
    constructor(service, departmentService) {
        this.service = service;
        this.departmentService = departmentService;
    }
    get base() {
        return this;
    }
    getMany(req, request) {
        try {
            const branchId = auth_1.getBranchId(request.headers.authorization);
            if (branchId) {
                const newReq = {
                    field: 'department.branch_id',
                    operator: 'eq',
                    value: branchId,
                };
                req.parsed.filter.push(newReq);
                if (!req.parsed.join.find(item => item.field === 'department')) {
                    req.parsed.join.push({ field: 'department' });
                }
                return this.service.customGetMany(req);
            }
            else {
                return this.service.customGetMany(req);
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
        }
    }
    getOneAndDoStuff(req) {
        try {
            return this.service.customGetOne(req);
        }
        catch (err) {
            throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
        }
    }
    createOne(req, dto) {
        try {
            return this.base.createOneBase(req, dto);
        }
        catch (err) {
            throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
        }
    }
    createMany(req, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listDataWithDepartment = yield dto.bulk.filter((item) => item.department);
                const listDepartment = yield listDataWithDepartment.map((item) => item.department);
                let listDepartmentByName = [];
                if (listDepartment.length > 0) {
                    listDepartmentByName = yield this.departmentService.findByNames(listDepartment);
                }
                const newDto = {
                    bulk: [],
                };
                let failDto = [];
                newDto.bulk = dto.bulk.map((el) => {
                    const findDepartment = listDepartmentByName.find((a) => {
                        return el.department === a.name;
                    });
                    let findGroup = {};
                    let dataShift = [];
                    let findPosition = {};
                    let findArea = {};
                    if (findDepartment) {
                        findGroup = findDepartment.groups.find((b) => {
                            return el.group === b.name;
                        });
                        findArea = findDepartment.areas.find((c) => {
                            return el.area === c.name;
                        });
                    }
                    if (findGroup &&
                        findGroup.schedule &&
                        findGroup.schedule.schedules[0].flexible_break === true) {
                        const shift = findDepartment.groups.map((data) => {
                            delete data.base_salary;
                            delete data.created_at;
                            delete data.day_salary;
                            delete data.updated_at;
                            delete data.week_salary;
                            return data;
                        });
                        dataShift = shift;
                    }
                    if (findArea && findDepartment) {
                        findPosition = findArea.positions.find((d) => {
                            return el.skill === d.name;
                        });
                    }
                    if (dataShift.length > 0) {
                        return Object.assign(Object.assign({}, el), { department_id: findDepartment ? findDepartment.id : null, group_id: findGroup ? findGroup.id : null, area_id: findArea ? findArea.id : null, position_id: findPosition ? findPosition.id : null, meta: Object.assign(Object.assign({}, el.meta), { schedule_shift: dataShift }) });
                    }
                    else {
                        return Object.assign(Object.assign({}, el), { department_id: findDepartment ? findDepartment.id : null, group_id: findGroup ? findGroup.id : null, area_id: findArea ? findArea.id : null, position_id: findPosition ? findPosition.id : null });
                    }
                });
                failDto = newDto.bulk.filter((item) => !item.department_id ||
                    !item.group_id ||
                    !item.area_id ||
                    !item.position_id);
                const listNIK = yield newDto.bulk.map((el) => el.nik);
                const find = yield this.service.findByNiks(listNIK);
                if (failDto.length > 0) {
                    throw new common_1.HttpException(failDto, 406);
                }
                else if (find.length > 0) {
                    const newDuplicate = newDto.bulk.map((el) => {
                        const findIds = find.find((item) => {
                            return el.nik === item.nik;
                        });
                        if (findIds) {
                            el = Object.assign(Object.assign({}, el), { duplicate: true });
                        }
                        return el;
                    });
                    throw new common_1.HttpException(newDuplicate, 409);
                }
                else {
                    return this.base.createManyBase(req, newDto);
                }
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 409);
            }
        });
    }
    updateOne(req, dto, request) {
        try {
            const accountId = auth_1.getAccountId(request.headers.authorization);
            return this.service.customUpdateOne(req, dto, { accountId });
        }
        catch (err) {
            throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
        }
    }
    replaceOne(req, dto, request) {
        try {
            const accountId = auth_1.getAccountId(request.headers.authorization);
            return this.service.customReplaceOne(req, dto, { accountId });
        }
        catch (err) {
            throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
        }
    }
    deleteOne(req, request) {
        try {
            const accountId = auth_1.getAccountId(request.headers.authorization);
            return this.service.customDeleteOne(req, { accountId });
        }
        catch (err) {
            throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
        }
    }
    getBirthday() {
        try {
            return this.service.getEmployeeBirthday();
        }
        catch (err) {
            throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
        }
    }
    getTotalEmployee() {
        try {
            return this.service.getTotalEmployee();
        }
        catch (err) {
            throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
        }
    }
    switchGroup(request) {
        try {
            const accountId = auth_1.getAccountId(request.headers.authorization);
            return this.service.switchGroup({ accountId });
        }
        catch (err) {
            throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
        }
    }
    getEmployeeDataForPayslip(query) {
        try {
            return this.service.getEmployeeDataForPayslip(query);
        }
        catch (err) {
            throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
        }
    }
    getDbBackup(request) {
        try {
            const accountId = auth_1.getAccountId(request.headers.authorization);
            if (accountId) {
                const dump = mysqldump_1.default({
                    connection: {
                        host: process.env.TYPEORM_HOST,
                        user: process.env.TYPEORM_USERNAME,
                        password: process.env.TYPEORM_PASSWORD,
                        database: process.env.TYPEORM_DATABASE,
                    },
                });
                return dump;
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
        }
    }
};
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "getMany", null);
__decorate([
    crud_1.Override('getOneBase'),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "getOneAndDoStuff", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, employee_entity_1.Employee]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "createOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "createMany", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, employee_entity_1.Employee, Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "updateOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, employee_entity_1.Employee, Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "replaceOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "deleteOne", null);
__decorate([
    common_1.Get('custom/getBirthday'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "getBirthday", null);
__decorate([
    common_1.Get('custom/getTotalEmployee'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "getTotalEmployee", null);
__decorate([
    common_1.Put('custom/switchGroup'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "switchGroup", null);
__decorate([
    common_1.Get('custom/getEmployeeDataForPayslip'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.GetEmployeeDataForPayslipDto]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "getEmployeeDataForPayslip", null);
__decorate([
    common_1.Get('/custom/backup'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "getDbBackup", null);
EmployeeController = __decorate([
    crud_1.Crud({
        model: {
            type: employee_entity_1.Employee,
        },
        params: {
            id: {
                field: 'id',
                type: 'string',
                primary: true,
            },
        },
        query: {
            join: {
                group: {
                    exclude: [],
                },
                department: {
                    exclude: [],
                },
                area: {
                    exclude: [],
                },
                position: {
                    exclude: [],
                },
                attendances: {
                    exclude: [],
                },
                leaves: {
                    exclude: [],
                },
                loans: {
                    exclude: [],
                },
            },
        },
    }),
    swagger_1.ApiUseTags('Employees'),
    common_1.Controller('employees'),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    swagger_1.ApiBearerAuth(),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService,
        department_service_1.DepartmentService])
], EmployeeController);
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=employee.controller.js.map