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
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = require("@nestjs/swagger");
class QueryReportCost {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], QueryReportCost.prototype, "year", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], QueryReportCost.prototype, "month", void 0);
exports.QueryReportCost = QueryReportCost;
class QueryEmployeeLateMonthly {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], QueryEmployeeLateMonthly.prototype, "date", void 0);
exports.QueryEmployeeLateMonthly = QueryEmployeeLateMonthly;
class QueryEmployeeLateWeekly {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], QueryEmployeeLateWeekly.prototype, "dateStart", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], QueryEmployeeLateWeekly.prototype, "dateEnd", void 0);
exports.QueryEmployeeLateWeekly = QueryEmployeeLateWeekly;
class QueryOvertimeEmployee {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], QueryOvertimeEmployee.prototype, "dateStart", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], QueryOvertimeEmployee.prototype, "dateEnd", void 0);
exports.QueryOvertimeEmployee = QueryOvertimeEmployee;
class QueryOutcomeReport {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], QueryOutcomeReport.prototype, "dateStart", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], QueryOutcomeReport.prototype, "dateEnd", void 0);
exports.QueryOutcomeReport = QueryOutcomeReport;
//# sourceMappingURL=query.dto.js.map