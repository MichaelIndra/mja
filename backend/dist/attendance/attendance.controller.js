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
const attendance_entity_1 = require("./attendance.entity");
const attendance_service_1 = require("./attendance.service");
const crud_1 = require("@nestjsx/crud");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/role/roles.guard");
const employee_service_1 = require("../employee/employee.service");
const attendance_dto_1 = require("./attendance.dto");
const auth_1 = require("../utils/auth");
const delete_dto_1 = require("./delete.dto");
let AttendanceController = class AttendanceController {
    constructor(service, employeeService) {
        this.service = service;
        this.employeeService = employeeService;
    }
    get base() {
        return this;
    }
    getMany(req) {
        return this.base.getManyBase(req);
    }
    getOneAndDoStuff(req) {
        return this.base.getOneBase(req);
    }
    createOne(req, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!dto.employee_id && !dto.employee_nik) {
                    throw new common_1.HttpException('Please provide employee_id or employee_nik', 400);
                }
                const currentAttendance = yield this.service.checkForDuplicate(dto);
                if (currentAttendance && currentAttendance.length > 0) {
                    throw new common_1.HttpException('Duplicate entry detected', 409);
                }
                let newDto = dto;
                if (dto.employee_nik) {
                    const employees = yield this.employeeService.findByNiks([
                        dto.employee_nik,
                    ]);
                    if (employees.length === 0) {
                        throw new common_1.NotFoundException('Employee is not found');
                    }
                    newDto = Object.assign(Object.assign({}, dto), { employee_id: employees[0] });
                    delete newDto.employee_nik;
                }
                return yield this.base.createOneBase(req, newDto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
            }
        });
    }
    createMany(req, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listDataWithNik = yield dto.bulk.filter((item) => item.employee_nik);
                const listNik = yield listDataWithNik.map((item) => item.employee_nik);
                const listDataWithId = yield dto.bulk.filter((item) => item.employee_id);
                const listId = yield listDataWithId.map((item) => item.employee_id);
                let listEmployeesByNik = [];
                if (listNik.length > 0) {
                    listEmployeesByNik = yield this.employeeService.findByNiks(listNik);
                }
                let listEmployeesById = [];
                if (listId.length > 0) {
                    listEmployeesById = yield this.employeeService.findByIds(listId);
                }
                const timeList = yield this.service.find({
                    select: [
                        'employee_id',
                        'time_check_in',
                        'time_check_out_for_break',
                        'time_check_in_for_break',
                        'time_check_out',
                    ],
                });
                const newDto = {
                    bulk: [],
                };
                for (const index in dto.bulk) {
                    if (dto.bulk[index]) {
                        const data = dto.bulk[index];
                        if (!data.employee_id && !data.employee_nik) {
                            throw new common_1.HttpException(`Please provide employee_id or employee_nik (row: ${index + 1})`, 400);
                        }
                        else if (data.employee_nik) {
                            const currentAttendance = yield this.service.checkForDuplicate(data);
                            if (currentAttendance && currentAttendance.length > 0) {
                                throw new common_1.HttpException('Duplicate entry detected', 409);
                            }
                            const findEmployee = yield listEmployeesByNik.find(item => item.nik.toString() === data.employee_nik.toString());
                            if (findEmployee) {
                                const newData = Object.assign(Object.assign({}, data), { employee_id: findEmployee.id });
                                const validate = timeList.find((item) => {
                                    return (item.employee_id === newData.employee_id &&
                                        item.time_check_in.toLocaleString() ===
                                            new Date(data.time_check_in).toLocaleString() &&
                                        item.time_check_out_for_break.toLocaleString() ===
                                            new Date(data.time_check_out_for_break).toLocaleString() &&
                                        item.time_check_in_for_break.toLocaleString() ===
                                            new Date(data.time_check_in_for_break).toLocaleString() &&
                                        item.time_check_out.toLocaleString() ===
                                            new Date(data.time_check_out).toLocaleString());
                                });
                                if (validate) {
                                    throw new common_1.HttpException(`Duplicate datetime on NIK ${data.employee_nik}, row: ${index})`, 409);
                                }
                                else {
                                    delete newData.employee_nik;
                                    newDto.bulk.push(newData);
                                }
                            }
                            else {
                                throw new common_1.HttpException(`Employee is not found (NIK: ${data.employee_nik}, row: ${index})`, 404);
                            }
                        }
                        else {
                            const findEmployee = yield listEmployeesByNik.find(item => item.nik === data.employee_nik);
                            if (findEmployee) {
                                const newData = Object.assign({}, data);
                                const validate = timeList.find((item) => {
                                    return (item.employee_id === newData.employee_id &&
                                        item.time_check_in.toLocaleString() ===
                                            new Date(data.time_check_in).toLocaleString() &&
                                        item.time_check_out_for_break.toLocaleString() ===
                                            new Date(data.time_check_out_for_break).toLocaleString() &&
                                        item.time_check_in_for_break.toLocaleString() ===
                                            new Date(data.time_check_in_for_break).toLocaleString() &&
                                        item.time_check_out.toLocaleString() ===
                                            new Date(data.time_check_out).toLocaleString());
                                });
                                if (validate) {
                                    throw new common_1.HttpException(`Duplicate datetime on NIK ${data.employee_nik}, row: ${index})`, 400);
                                }
                                else {
                                    delete newData.employee_nik;
                                    newDto.bulk.push(newData);
                                }
                            }
                            else {
                                throw new common_1.HttpException(`Employee is not found (ID: ${data.employee_id}, row: ${index})`, 404);
                            }
                        }
                    }
                }
                const xx = newDto.bulk.filter((item) => !item.meta);
                return yield this.base.createManyBase(req, newDto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
            }
        });
    }
    updateOne(req, dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = yield auth_1.getAccountId(request.headers.authorization);
            return yield this.service.customUpdateOne(req, dto, { accountId });
        });
    }
    replaceOne(req, dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = yield auth_1.getAccountId(request.headers.authorization);
            return yield this.service.customReplaceOne(req, dto, { accountId });
        });
    }
    deleteOne(req, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = yield auth_1.getAccountId(request.headers.authorization);
            return yield this.service.customDeleteOne(req, { accountId });
        });
    }
    deleteMany(dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = yield auth_1.getAccountId(request.headers.authorization);
            return yield this.service.deleteMany(dto);
        });
    }
};
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getMany", null);
__decorate([
    crud_1.Override('getOneBase'),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getOneAndDoStuff", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, attendance_dto_1.CreateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "createOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, attendance_dto_1.CreateManyAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "createMany", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, crud_1.ParsedBody()), __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, attendance_entity_1.Attendance, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "updateOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, crud_1.ParsedBody()), __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, attendance_entity_1.Attendance, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "replaceOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "deleteOne", null);
__decorate([
    common_1.Delete('custom/bulk'),
    __param(0, common_1.Body()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_dto_1.DeleteManyDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "deleteMany", null);
AttendanceController = __decorate([
    crud_1.Crud({
        model: {
            type: attendance_entity_1.Attendance,
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
                employee: {
                    exclude: [],
                },
                'employee.group': {
                    exclude: [],
                },
                'employee.department': {
                    exclude: [],
                },
                'employee.department.groups': {
                    exclude: [],
                },
                'employee.area': {
                    exclude: [],
                },
                'employee.position': {
                    exclude: [],
                },
            },
        },
    }),
    swagger_1.ApiUseTags('Attendances'),
    common_1.Controller('attendances'),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    swagger_1.ApiBearerAuth(),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService,
        employee_service_1.EmployeeService])
], AttendanceController);
exports.AttendanceController = AttendanceController;
//# sourceMappingURL=attendance.controller.js.map