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
const area_entity_1 = require("./area.entity");
const area_service_1 = require("./area.service");
const roles_guard_1 = require("../../auth/role/roles.guard");
const crud_1 = require("@nestjsx/crud");
const swagger_1 = require("@nestjs/swagger");
let AreaController = class AreaController {
    constructor(service) {
        this.service = service;
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
        const paramsDepartment = req.parsed.paramsFilter.find(item => item.field === 'department_id');
        const departmentId = paramsDepartment.value;
        const newDto = Object.assign(Object.assign({}, dto), { department_id: departmentId });
        return this.base.createOneBase(req, newDto);
    }
    createMany(req, dto) {
        return this.base.createManyBase(req, dto);
    }
    coolFunction(req, dto) {
        return this.base.updateOneBase(req, dto);
    }
    awesomePUT(req, dto) {
        return this.base.replaceOneBase(req, dto);
    }
    deleteOne(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.base.deleteOneBase(req);
        });
    }
};
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "getMany", null);
__decorate([
    crud_1.Override('getOneBase'),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "getOneAndDoStuff", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, area_entity_1.Area]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "createOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "createMany", null);
__decorate([
    crud_1.Override('updateOneBase'),
    __param(0, crud_1.ParsedRequest()), __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, area_entity_1.Area]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "coolFunction", null);
__decorate([
    crud_1.Override('replaceOneBase'),
    __param(0, crud_1.ParsedRequest()), __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, area_entity_1.Area]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "awesomePUT", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AreaController.prototype, "deleteOne", null);
AreaController = __decorate([
    crud_1.Crud({
        model: {
            type: area_entity_1.Area,
        },
        params: {
            departmentId: {
                field: 'department_id',
                type: 'string',
            },
            id: {
                field: 'id',
                type: 'string',
                primary: true,
            },
        },
    }),
    swagger_1.ApiUseTags('Areas'),
    common_1.Controller('departments/:departmentId/areas'),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [area_service_1.AreaService])
], AreaController);
exports.AreaController = AreaController;
//# sourceMappingURL=area.controller.js.map