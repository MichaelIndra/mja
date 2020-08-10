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
const department_entity_1 = require("./department.entity");
const employee_entity_1 = require("../employee/employee.entity");
const typeorm_2 = require("typeorm");
let DepartmentService = class DepartmentService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo, employeeRepository) {
        super(repo);
        this.employeeRepository = employeeRepository;
    }
    findByNames(names) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (names.length === 0) {
                    return Promise.reject({
                        statusCode: 400,
                        message: 'Department name must be an array of string',
                    });
                }
                const res = yield this.repo.find({
                    where: { name: typeorm_2.In(names) },
                    relations: [
                        'groups',
                        'areas',
                        'areas.positions',
                    ],
                });
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    findEmployeeByDepartmentId(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.employeeRepository.find({
                    where: { department_id: departmentId },
                });
                console.info('res', res);
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
DepartmentService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(department_entity_1.Department)),
    __param(1, typeorm_1.InjectRepository(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository])
], DepartmentService);
exports.DepartmentService = DepartmentService;
//# sourceMappingURL=department.service.js.map