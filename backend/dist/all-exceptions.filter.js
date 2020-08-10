"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (!exception) {
            const tmpData = {
                statusCode: status,
                name: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error..',
            };
            console.error('ERROR WITHOUT EXCEPTION', tmpData);
            response.status(500).json(tmpData);
        }
        else if (exception.name === 'TimeoutError') {
            console.error('ERROR TIMEOUT', request.url);
            process.exit();
        }
        else {
            let tmpData;
            if (exception.message.message) {
                tmpData = Object.assign({ statusCode: status, name: exception.name, timestamp: new Date().toISOString(), path: request.url }, exception.message);
            }
            else {
                tmpData = {
                    statusCode: status,
                    name: exception.name,
                    message: exception.message,
                    data: exception.message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                };
            }
            console.error('ERROR FROM EXCEPTION', tmpData);
            response.status(status).json(tmpData);
        }
    }
};
AllExceptionsFilter = __decorate([
    common_1.Catch()
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;
//# sourceMappingURL=all-exceptions.filter.js.map