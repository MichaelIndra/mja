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
const attendance_entity_1 = require("./attendance.entity");
const constants_1 = require("../utils/constants");
const log_service_1 = require("../log/log.service");
const log_constants_1 = require("../log/log.constants");
const queryTransformer_1 = require("../utils/queryTransformer");
let AttendanceService = class AttendanceService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo, logService) {
        super(repo);
        this.logService = logService;
    }
    checkForDuplicate(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.repo
                    .createQueryBuilder('attendances')
                    .select(['time_check_in', 'employee_id'])
                    .where('DAY(time_check_in) = :day AND MONTH(time_check_in) = :month AND YEAR(time_check_in) = :year AND employee_id = :employee_id', {
                    day: new Date(dto.time_check_in).getDate(),
                    month: new Date(dto.time_check_in).getMonth() + 1,
                    year: new Date(dto.time_check_in).getFullYear(),
                    employee_id: dto.employee_id,
                });
                const result = res.execute();
                if (result) {
                    return result;
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
                    entity: constants_1.ENTITIES.attendance,
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
                    entity: constants_1.ENTITIES.attendance,
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
                entity: constants_1.ENTITIES.attendance,
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
                const oldKeys = yield Object.keys(oldData.meta);
                const newKeys = yield Object.keys(newData.meta);
                const keys = oldKeys.concat(newKeys);
                const trackedKeys = [];
                const excludes = log_constants_1.LOG_GROUP_EXCLUDE;
                for (const key of keys) {
                    if (trackedKeys.includes(key)) {
                    }
                    else {
                        if (excludes.includes(key)) {
                        }
                        else if (oldData.meta[key] !== newData.meta[key]) {
                            isAnyChange = true;
                        }
                        else {
                        }
                        trackedKeys.push(key);
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
    deleteMany(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (dto.isAllSelected) {
                    const queries = yield queryTransformer_1.convertQuery(dto.query);
                    let queryBuilder = yield this.repo.createQueryBuilder('attendance');
                    queryBuilder = yield queryBuilder.leftJoinAndSelect('attendance.employee', 'employee');
                    queryBuilder = yield queryBuilder.select('attendance.id');
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
AttendanceService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(attendance_entity_1.Attendance)),
    __metadata("design:paramtypes", [Object, log_service_1.LogService])
], AttendanceService);
exports.AttendanceService = AttendanceService;
//# sourceMappingURL=attendance.service.js.map