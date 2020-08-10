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
const leave_entity_1 = require("./leave.entity");
const leave_service_1 = require("./leave.service");
const roles_guard_1 = require("../auth/role/roles.guard");
const crud_1 = require("@nestjsx/crud");
const swagger_1 = require("@nestjs/swagger");
const leave_dto_1 = require("./leave.dto");
let LeaveController = class LeaveController {
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
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.service.checkForDuplicate(dto);
            const validateAttendance = yield this.service.validateAttendance(dto);
            const totalLeaveDurationInSeconds = new Date(dto.date_end).getTime() - new Date(dto.date_start).getTime();
            if (totalLeaveDurationInSeconds > 0 &&
                totalLeaveDurationInSeconds <= 28800) {
                if (Number(count)) {
                    return this.base.createOneBase(req, dto);
                }
                else {
                    throw new common_1.HttpException('Duplicate value', 409);
                }
            }
            else {
                if (Number(count) === 0 && Number(validateAttendance) === 0) {
                    return this.base.createOneBase(req, dto);
                }
                else {
                    if (Number(count) > 0) {
                        throw new common_1.HttpException('Duplicate value', 409);
                    }
                    if (Number(validateAttendance) > 0) {
                        throw new common_1.HttpException('Attendance data exist', 406);
                    }
                }
            }
        });
    }
    createMany(req, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            let countError = 0;
            for (const leaveItem of dto.bulk) {
                countError += Number(yield this.service.checkForDuplicate(leaveItem));
            }
            if (countError === 0) {
                return this.base.createManyBase(req, dto);
            }
            else {
                throw new common_1.HttpException('Duplicate value', 409);
            }
        });
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
    deleteMany(dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
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
], LeaveController.prototype, "getMany", null);
__decorate([
    crud_1.Override('getOneBase'),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "getOneAndDoStuff", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, leave_entity_1.Leave]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "createOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "createMany", null);
__decorate([
    crud_1.Override('updateOneBase'),
    __param(0, crud_1.ParsedRequest()), __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, leave_entity_1.Leave]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "coolFunction", null);
__decorate([
    crud_1.Override('replaceOneBase'),
    __param(0, crud_1.ParsedRequest()), __param(1, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, leave_entity_1.Leave]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "awesomePUT", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "deleteOne", null);
__decorate([
    common_1.Delete('delete/bulk'),
    __param(0, common_1.Body()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_dto_1.DeleteManyLeaveDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "deleteMany", null);
LeaveController = __decorate([
    crud_1.Crud({
        model: {
            type: leave_entity_1.Leave,
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
                'employee.area': {
                    exclude: [],
                },
                'employee.position': {
                    exclude: [],
                },
            },
        },
    }),
    swagger_1.ApiUseTags('Leaves'),
    common_1.Controller('leaves'),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    swagger_1.ApiBearerAuth(),
    __metadata("design:paramtypes", [leave_service_1.LeaveService])
], LeaveController);
exports.LeaveController = LeaveController;
//# sourceMappingURL=leave.controller.js.map