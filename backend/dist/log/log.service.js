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
const log_entity_1 = require("./log.entity");
const typeorm_2 = require("typeorm");
const department_entity_1 = require("../department/department.entity");
const group_entity_1 = require("../department/group/group.entity");
const area_entity_1 = require("../department/area/area.entity");
const position_entity_1 = require("../department/area/position/position.entity");
const constants_1 = require("../utils/constants");
const log_constants_1 = require("./log.constants");
let LogService = class LogService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo, departmentRepository, groupRepository, areaRepository, positionRepository) {
        super(repo);
        this.departmentRepository = departmentRepository;
        this.groupRepository = groupRepository;
        this.areaRepository = areaRepository;
        this.positionRepository = positionRepository;
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield this.repo.create(dto);
            return yield this.repo.save(created);
        });
    }
    getMany(req) {
        const _super = Object.create(null, {
            getMany: { get: () => super.getMany }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield _super.getMany.call(this, req);
            res = yield this.getChangeDetails(res);
            return res;
        });
    }
    getOne(req) {
        const _super = Object.create(null, {
            getOne: { get: () => super.getOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield _super.getOne.call(this, req);
            res = yield this.getChangeDetail(res);
            return res;
        });
    }
    getChangeDetails(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let datas;
            if (res.data) {
                datas = res.data;
            }
            else {
                datas = res;
            }
            for (const index in datas) {
                if (datas[index]) {
                    datas[index] = yield this.getChangeDetail(datas[index]);
                }
            }
            if (res.data) {
                res.data = datas;
            }
            else {
                res = datas;
            }
            return res;
        });
    }
    getChangeDetail(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const listChange = [];
            let oldData = res.meta.previous_data;
            let newData = res.meta.current_data;
            if (res.action === 'UPDATE') {
                if (res.entity === constants_1.ENTITIES.employee) {
                    if (oldData.department_id !==
                        newData.department_id) {
                        let department = yield this.departmentRepository.findOne(oldData.department_id);
                        oldData = Object.assign(Object.assign({}, oldData), { department });
                        department = yield this.departmentRepository.findOne(newData.department_id);
                        newData = Object.assign(Object.assign({}, newData), { department });
                        listChange.push('department_id');
                    }
                    if (oldData.group_id !== newData.group_id) {
                        let group = yield this.groupRepository.findOne(oldData.group_id);
                        oldData = Object.assign(Object.assign({}, oldData), { group });
                        group = yield this.groupRepository.findOne(newData.group_id);
                        newData = Object.assign(Object.assign({}, newData), { group });
                        listChange.push('group_id');
                    }
                    if (oldData.area_id !== newData.area_id) {
                        let area = yield this.areaRepository.findOne(oldData.area_id);
                        oldData = Object.assign(Object.assign({}, oldData), { area });
                        area = yield this.areaRepository.findOne(newData.area_id);
                        newData = Object.assign(Object.assign({}, newData), { area });
                        listChange.push('area_id');
                    }
                    if (oldData.position_id !== newData.position_id) {
                        let position = yield this.positionRepository.findOne(oldData.position_id);
                        oldData = Object.assign(Object.assign({}, oldData), { position });
                        position = yield this.positionRepository.findOne(newData.position_id);
                        newData = Object.assign(Object.assign({}, newData), { position });
                        listChange.push('position_id');
                    }
                    if (oldData.meta && newData.meta) {
                        const keys = yield Object.keys(oldData.meta.payslip);
                        for (const key of keys) {
                            if (oldData.meta.payslip[key] !== newData.meta.payslip[key]) {
                                listChange.push('meta.payslip' + key);
                            }
                        }
                    }
                }
                if (res.entity === constants_1.ENTITIES.attendance) {
                    if (oldData.meta && newData.meta) {
                        const keys = yield Object.keys(oldData.meta);
                        const excludes = log_constants_1.LOG_GROUP_EXCLUDE;
                        for (const key of keys) {
                            if (!excludes.includes(key) && oldData.meta[key] !== newData.meta[key]) {
                                listChange.push(key);
                            }
                        }
                    }
                }
                if (res.entity === constants_1.ENTITIES.group) {
                    if (oldData.base_salary !== newData.base_salary) {
                        listChange.push('base_salary');
                    }
                }
            }
            else if (res.action === 'DELETE') {
                const department = yield this.departmentRepository.findOne(oldData.department_id);
                oldData = Object.assign(Object.assign({}, oldData), { department });
                const group = yield this.groupRepository.findOne(oldData.group_id);
                oldData = Object.assign(Object.assign({}, oldData), { group });
                const area = yield this.areaRepository.findOne(oldData.area_id);
                oldData = Object.assign(Object.assign({}, oldData), { area });
                const position = yield this.positionRepository.findOne(oldData.position_id);
                oldData = Object.assign(Object.assign({}, oldData), { position });
            }
            return Object.assign(Object.assign({}, res), { meta: Object.assign(Object.assign({}, res.meta), { previous_data: oldData, current_data: newData }), listChange });
        });
    }
};
LogService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(log_entity_1.Log)),
    __param(1, typeorm_1.InjectRepository(department_entity_1.Department)),
    __param(2, typeorm_1.InjectRepository(group_entity_1.Group)),
    __param(3, typeorm_1.InjectRepository(area_entity_1.Area)),
    __param(4, typeorm_1.InjectRepository(position_entity_1.Position)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LogService);
exports.LogService = LogService;
//# sourceMappingURL=log.service.js.map