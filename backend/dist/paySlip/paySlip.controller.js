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
const paySlip_entity_1 = require("./paySlip.entity");
const paySlip_service_1 = require("./paySlip.service");
const role_decorator_1 = require("../auth/role/role.decorator");
const crud_1 = require("@nestjsx/crud");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../utils/auth");
const query_dto_1 = require("../report/query.dto");
let PaySlipController = class PaySlipController {
    constructor(service) {
        this.service = service;
    }
    get base() {
        return this;
    }
    getMany(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.base.getManyBase(req);
            const filterList = req.parsed.filter;
            if (filterList.length > 0) {
                let dateStart = filterList.find((el) => el.field === 'start_at' && el.operator === 'gte');
                let dateEnd = filterList.find((el) => el.field === 'end_at' && el.operator === 'lte');
                if (dateStart) {
                    dateStart = dateStart.value;
                }
                else {
                    dateStart = new Date().toISOString();
                }
                if (dateEnd) {
                    dateEnd = dateEnd.value;
                }
                else {
                    dateEnd = new Date().toISOString();
                }
                const dateFilter = {
                    start_at: dateStart,
                    end_at: dateEnd,
                };
                const totalOvertime = yield this.service.getTotalOvertime(dateFilter);
                return Object.assign(Object.assign({}, res), { report: totalOvertime });
            }
            else {
                const date = new Date();
                const firstDay = new Date(date.getFullYear(), date.getMonth() - 2, 1);
                const lastDay = new Date(date.getFullYear(), date.getMonth() - 1, 0);
                const dateFilter = {
                    start_at: firstDay,
                    end_at: lastDay,
                };
                const totalOvertime = yield this.service.getTotalOvertime(dateFilter);
                return Object.assign(Object.assign({}, res), { report: totalOvertime });
            }
        });
    }
    getOneAndDoStuff(req) {
        return this.base.getOneBase(req);
    }
    createOne(req, dto) {
        return this.base.createOneBase(req, dto);
    }
    createMany(req, dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountId = yield auth_1.getAccountId(request.headers.authorization);
                return yield this.service.customCreateMany(dto, { accountId });
            }
            catch (err) {
                throw new common_1.HttpException(err.message || JSON.stringify(err), err.status || err.statusCode || 500);
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
    updateMany(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountId = yield auth_1.getAccountId(request.headers.authorization);
                return yield this.service.customUpdateMany(request.body, { accountId });
            }
            catch (err) {
                throw new common_1.HttpException(err.message || JSON.stringify(err), err.status || err.statusCode || 500);
            }
        });
    }
    getOutcomeReport(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.service.getOutcomeReport(query);
                return Object.assign(Object.assign({}, res), { report: [] });
            }
            catch (err) {
                throw new common_1.HttpException(err.message || JSON.stringify(err), err.status || err.statusCode || 500);
            }
        });
    }
    getTotalOutcomeReport(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.service.getTotalOutcomeReport(query);
                return Object.assign({}, res);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || JSON.stringify(err), err.status || err.statusCode || 500);
            }
        });
    }
    getOvertimeReport(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.service.getOvertimeReport(query);
                return Object.assign({}, res);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || JSON.stringify(err), err.status || err.statusCode || 500);
            }
        });
    }
    getTotalOvertimeReport(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.service.getTotalOvertimeReport(query);
                return Object.assign({}, res);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || JSON.stringify(err), err.status || err.statusCode || 500);
            }
        });
    }
};
__decorate([
    role_decorator_1.Roles('admin'),
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaySlipController.prototype, "getMany", null);
__decorate([
    crud_1.Override('getOneBase'),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaySlipController.prototype, "getOneAndDoStuff", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paySlip_entity_1.PaySlip]),
    __metadata("design:returntype", void 0)
], PaySlipController.prototype, "createOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaySlipController.prototype, "createMany", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paySlip_entity_1.PaySlip, Object]),
    __metadata("design:returntype", Promise)
], PaySlipController.prototype, "updateOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paySlip_entity_1.PaySlip, Object]),
    __metadata("design:returntype", Promise)
], PaySlipController.prototype, "replaceOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaySlipController.prototype, "deleteOne", null);
__decorate([
    common_1.Put('/custom/bulkUpdate'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaySlipController.prototype, "updateMany", null);
__decorate([
    common_1.Get('/custom/getOutcomeReport'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryOutcomeReport]),
    __metadata("design:returntype", Promise)
], PaySlipController.prototype, "getOutcomeReport", null);
__decorate([
    common_1.Get('/custom/getTotalOutcomeReport'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryOutcomeReport]),
    __metadata("design:returntype", Promise)
], PaySlipController.prototype, "getTotalOutcomeReport", null);
__decorate([
    common_1.Get('/custom/getOvertimeReport'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryOutcomeReport]),
    __metadata("design:returntype", Promise)
], PaySlipController.prototype, "getOvertimeReport", null);
__decorate([
    common_1.Get('/custom/getTotalOvertimeReport'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryOutcomeReport]),
    __metadata("design:returntype", Promise)
], PaySlipController.prototype, "getTotalOvertimeReport", null);
PaySlipController = __decorate([
    crud_1.Crud({
        model: {
            type: paySlip_entity_1.PaySlip,
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
            },
        },
    }),
    swagger_1.ApiUseTags('PaySlips'),
    common_1.Controller('payslips'),
    swagger_1.ApiBearerAuth(),
    __metadata("design:paramtypes", [paySlip_service_1.PaySlipService])
], PaySlipController);
exports.PaySlipController = PaySlipController;
//# sourceMappingURL=paySlip.controller.js.map