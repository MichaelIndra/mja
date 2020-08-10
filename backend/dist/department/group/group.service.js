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
const group_entity_1 = require("./group.entity");
const typeorm_2 = require("typeorm");
const constants_1 = require("../../utils/constants");
const log_service_1 = require("../../log/log.service");
let GroupService = class GroupService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo, logService) {
        super(repo);
        this.logService = logService;
    }
    findByName(names) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (names.length === 0) {
                    return Promise.reject({
                        statusCode: 400,
                        message: 'Group name must be an array of string',
                    });
                }
                const res = yield this.repo.find({
                    where: { name: typeorm_2.In(names) },
                });
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
            const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
            const oldData = yield _super.findOne.call(this, filterId.value);
            const res = yield _super.updateOne.call(this, req, dto);
            const newData = yield _super.findOne.call(this, filterId.value);
            const changeDetail = yield this.getChangeDetail(oldData, newData);
            if (changeDetail.isAnyChange) {
                yield this.logService.create({
                    entity: constants_1.ENTITIES.group,
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
                    entity: constants_1.ENTITIES.group,
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
                entity: constants_1.ENTITIES.employee,
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
            if (oldData.base_salary !== newData.base_salary) {
                isAnyChange = true;
            }
            return {
                isAnyChange,
                oldData,
                newData,
            };
        });
    }
    getListSwitchable() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.createQueryBuilder('group')
                    .leftJoinAndSelect('group.department', 'department')
                    .where('group.switchable = 1').orderBy('group.department_id', 'ASC').addOrderBy('group.name', 'ASC').getMany();
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
GroupService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(group_entity_1.Group)),
    __metadata("design:paramtypes", [Object, log_service_1.LogService])
], GroupService);
exports.GroupService = GroupService;
//# sourceMappingURL=group.service.js.map