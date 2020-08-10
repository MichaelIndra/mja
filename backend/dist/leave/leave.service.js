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
const leave_entity_1 = require("./leave.entity");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("../attendance/attendance.entity");
const queryTransformer_1 = require("../utils/queryTransformer");
let LeaveService = class LeaveService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo) {
        super(repo);
    }
    checkForDuplicate(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = yield this.repo
                    .createQueryBuilder('leaves')
                    .where('employee_id = :employee_id', Object.assign({}, dto))
                    .andWhere(`(IF(CONVERT_TZ(:date_start,'+00:00','+07:00') >= date_start AND CONVERT_TZ(:date_start,'+00:00','+07:00') <= date_end,'TRUE','FALSE')='TRUE'
      OR IF(CONVERT_TZ(:date_end,'+00:00','+07:00') >= date_start AND CONVERT_TZ(:date_end,'+00:00','+07:00') <= date_end,'TRUE','FALSE')='TRUE'
      OR IF(CONVERT_TZ(:date_start,'+00:00','+07:00') <= date_start AND CONVERT_TZ(:date_end,'+00:00','+07:00') >= date_end,'TRUE','FALSE')='TRUE')`, Object.assign({}, dto));
                return yield queryBuilder.getCount();
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    validateAttendance(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = yield typeorm_2.createQueryBuilder()
                    .select('attendances')
                    .from(attendance_entity_1.Attendance, 'attendance')
                    .where('attendance.employee_id = :employee_id', Object.assign({}, dto))
                    .andWhere('attendance.time_check_in >= :date_start AND attendance.time_check_out <= :date_end', Object.assign({}, dto));
                return yield queryBuilder.getCount();
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    deleteMany(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (dto.isAllSelected) {
                    const queries = yield queryTransformer_1.convertQuery(dto.query);
                    let queryBuilder = yield this.repo.createQueryBuilder('leave');
                    queryBuilder = yield queryBuilder.leftJoinAndSelect('leave.employee', 'employee');
                    queryBuilder = yield queryBuilder.select('leave.id');
                    if (queries) {
                        for (const filter of queries.filters) {
                            queryBuilder = yield queryBuilder.andWhere(`${filter.field} ${filter.operator} ${JSON.stringify(filter.value)}`);
                        }
                    }
                    else {
                        throw new common_1.HttpException('Query not valid: ', 400);
                    }
                    const res = yield queryBuilder.getMany();
                    if (res.length === 0) {
                        throw new common_1.HttpException('Not found', 404);
                    }
                    else {
                        const ids = yield res.map(item => item.id);
                        return yield this.repo.delete(ids);
                    }
                }
                else {
                    return yield this.repo.delete(dto.ids);
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
LeaveService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(leave_entity_1.Leave)),
    __metadata("design:paramtypes", [Object])
], LeaveService);
exports.LeaveService = LeaveService;
//# sourceMappingURL=leave.service.js.map