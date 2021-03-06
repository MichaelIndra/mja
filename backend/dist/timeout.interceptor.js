"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TimeoutInterceptor = class TimeoutInterceptor {
    intercept(context, next) {
        let maxDuration = 100000;
        const request = context.switchToHttp().getRequest();
        if (request.method === 'POST' && request.url.includes('bulk')) {
            maxDuration = 600000;
        }
        if (request.method === 'POST' && request.url.includes('password')) {
            maxDuration = 600000;
        }
        if (request.method === 'GET' && (request.url.includes('report-payslip-produksi' || request.url.includes('getEmployeeDataForPayslip')))) {
            maxDuration = 600000;
        }
        if (request.method === 'GET' && (request.url.includes('backup'))) {
            maxDuration = 600000;
        }
        return next.handle().pipe(operators_1.timeout(maxDuration));
    }
};
TimeoutInterceptor = __decorate([
    common_1.Injectable()
], TimeoutInterceptor);
exports.TimeoutInterceptor = TimeoutInterceptor;
//# sourceMappingURL=timeout.interceptor.js.map