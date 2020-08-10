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
const report_service_1 = require("./report.service");
const swagger_1 = require("@nestjs/swagger");
const query_dto_1 = require("./query.dto");
let ReportController = class ReportController {
    constructor(service) {
        this.service = service;
    }
    getTotalCost(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.service.getTotalCost(query);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || JSON.stringify(err), err.statusCode || err.status || 500);
            }
        });
    }
    getMostLateWeekly(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.service.getMostLateEmployeeWeekly(query);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
            }
        });
    }
    getMostLateMonthly(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.service.getMostLateEmployeeMonthly(query);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
            }
        });
    }
    getMostDiligentEmployeeMonthly(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.service.getMostDiligentEmployeeMonthly(query);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err, err.statusCode || err.status || 500);
            }
        });
    }
};
__decorate([
    common_1.Get('cost-per-month'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryReportCost]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getTotalCost", null);
__decorate([
    common_1.Get('report-most-late-employee-weekly'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryEmployeeLateWeekly]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getMostLateWeekly", null);
__decorate([
    common_1.Get('report-most-late-employee-monthly'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryEmployeeLateMonthly]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getMostLateMonthly", null);
__decorate([
    common_1.Get('report-most-diligent-employee-monthly'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryEmployeeLateMonthly]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getMostDiligentEmployeeMonthly", null);
ReportController = __decorate([
    swagger_1.ApiUseTags('Reports'),
    common_1.Controller('reports'),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
exports.ReportController = ReportController;
//# sourceMappingURL=report.controller.js.map