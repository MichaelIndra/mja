"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const dotenv = require("dotenv");
const { parsed } = dotenv.config({
    path: process.cwd() + '/.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = Object.assign(Object.assign({}, process.env), parsed);
const jwtService = new jwt_1.JwtService({
    secret: process.env.JWT_SECRET,
});
let AuthGuard = class AuthGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        if (!authorization) {
            return false;
        }
        const exp = authorization.split(' ');
        const token = exp[1];
        const verify = jwtService.verify(token);
        if (verify)
            return true;
        else
            false;
    }
};
AuthGuard = __decorate([
    common_1.Injectable()
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map