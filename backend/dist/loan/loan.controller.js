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
const loan_entity_1 = require("./loan.entity");
const loan_service_1 = require("./loan.service");
const crud_1 = require("@nestjsx/crud");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../utils/auth");
const roles_guard_1 = require("../auth/role/roles.guard");
const role_decorator_1 = require("../auth/role/role.decorator");
const auth_constant_1 = require("../auth/auth.constant");
let LoanController = class LoanController {
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
    createOne(req, dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountId = yield auth_1.getAccountId(request.headers.authorization);
                return yield this.service.customCreateOne(req, dto, { accountId });
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response || JSON.stringify(err), err.statusCode || err.status || 500);
            }
        });
    }
    createMany(req, dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountId = yield auth_1.getAccountId(request.headers.authorization);
                dto.bulk = yield dto.bulk.map((item) => {
                    return Object.assign(Object.assign({}, item), { created_by_id: accountId });
                });
                return yield this.base.createManyBase(req, dto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response || JSON.stringify(err), err.statusCode || err.status || 500);
            }
        });
    }
    updateOne(req, dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountId = yield auth_1.getAccountId(request.headers.authorization);
                return yield this.service.customUpdateOne(req, dto, { accountId });
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response || JSON.stringify(err), err.statusCode || err.status || 500);
            }
        });
    }
    replaceOne(req, dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountId = yield auth_1.getAccountId(request.headers.authorization);
                return yield this.service.customReplaceOne(req, dto, { accountId });
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response || JSON.stringify(err), err.statusCode || err.status || 500);
            }
        });
    }
    deleteOne(req, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountId = yield auth_1.getAccountId(request.headers.authorization);
                return yield this.service.customDeleteOne(req, { accountId });
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response || JSON.stringify(err), err.statusCode || err.status || 500);
            }
        });
    }
    getCurrentLoan(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.service.getCurrentLoanDetail(employeeId);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response || JSON.stringify(err), err.statusCode || err.status || 500);
            }
        });
    }
    getTotalLoan() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.service.getTotalLoanByDepartment();
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
], LoanController.prototype, "getMany", null);
__decorate([
    crud_1.Override('getOneBase'),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoanController.prototype, "getOneAndDoStuff", null);
__decorate([
    role_decorator_1.Roles(auth_constant_1.ROLES.ADMIN, auth_constant_1.ROLES.GENERAL_HR_PAYROLL, auth_constant_1.ROLES.OWNER),
    crud_1.Override('createOneBase'),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, loan_entity_1.Loan, Object]),
    __metadata("design:returntype", Promise)
], LoanController.prototype, "createOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LoanController.prototype, "createMany", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, loan_entity_1.Loan, Object]),
    __metadata("design:returntype", Promise)
], LoanController.prototype, "updateOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, loan_entity_1.Loan, Object]),
    __metadata("design:returntype", Promise)
], LoanController.prototype, "replaceOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LoanController.prototype, "deleteOne", null);
__decorate([
    common_1.Get('current-loan/:employee_id'),
    __param(0, common_1.Param('employee_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoanController.prototype, "getCurrentLoan", null);
__decorate([
    common_1.Get('custom/totalLoanByDepartment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoanController.prototype, "getTotalLoan", null);
LoanController = __decorate([
    crud_1.Crud({
        model: {
            type: loan_entity_1.Loan,
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
    swagger_1.ApiUseTags('Loans'),
    common_1.Controller('loans'),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    swagger_1.ApiBearerAuth(),
    __metadata("design:paramtypes", [loan_service_1.LoanService])
], LoanController);
exports.LoanController = LoanController;
//# sourceMappingURL=loan.controller.js.map