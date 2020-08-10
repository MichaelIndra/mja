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
const crud_1 = require("@nestjsx/crud");
const swagger_1 = require("@nestjs/swagger");
const outcome_service_1 = require("./outcome.service");
const outcome_entity_1 = require("./outcome.entity");
const roles_guard_1 = require("../auth/role/roles.guard");
const auth_1 = require("../utils/auth");
let OutcomeController = class OutcomeController {
    constructor(service) {
        this.service = service;
    }
    get base() {
        return this;
    }
    getMany(req) {
        return this.base.getManyBase(req);
    }
    createOne(req, dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRole = yield auth_1.getUserRole(request.headers.authorization);
                return this.service.customCreateOutcome(dto, userRole);
            }
            catch (error) {
                throw new common_1.HttpException({
                    message: 'Error, when try get data outcomes.',
                    data: {},
                }, 500);
            }
        });
    }
    createMany(req, dto) {
        return this.base.createManyBase(req, dto);
    }
    deleteOne(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.base.deleteOneBase(req);
        });
    }
    getTotalLoan(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.service.getOutcomePerDepartment(query);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response || JSON.stringify(err), err.statusCode || err.status || 500);
            }
        });
    }
};
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OutcomeController.prototype, "getMany", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OutcomeController.prototype, "createOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OutcomeController.prototype, "createMany", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OutcomeController.prototype, "deleteOne", null);
__decorate([
    common_1.Get('custom/getOutcomePerDepartment'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OutcomeController.prototype, "getTotalLoan", null);
OutcomeController = __decorate([
    crud_1.Crud({
        model: {
            type: outcome_entity_1.Outcome,
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
                department: {
                    exclude: [],
                },
            },
        },
    }),
    swagger_1.ApiUseTags('Outcomes'),
    common_1.Controller('outcomes'),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    swagger_1.ApiBearerAuth(),
    __metadata("design:paramtypes", [outcome_service_1.OutcomeService])
], OutcomeController);
exports.OutcomeController = OutcomeController;
//# sourceMappingURL=outcome.controller.js.map