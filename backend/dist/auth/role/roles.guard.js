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
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const dotenv = require("dotenv");
const { parsed } = dotenv.config({
    path: process.cwd() + '/.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = Object.assign(Object.assign({}, process.env), parsed);
const jwtService = new jwt_1.JwtService({
    secret: process.env.JWT_SECRET,
});
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const roles = this.reflector.get('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        if (!authorization) {
            return false;
        }
        const exp = authorization.split(' ');
        if (Array.isArray(exp) && exp.length > 0) {
        }
        else {
            return false;
        }
        const user = jwtService.decode(exp[1]);
        if (!user) {
            return false;
        }
        const hasRole = user.roles.find(role => roles.find(el => el === role));
        return hasRole ? true : false;
    }
};
RolesGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map