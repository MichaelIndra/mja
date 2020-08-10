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
const swagger_1 = require("@nestjs/swagger");
const mail_service_1 = require("../services/mail.service");
const feature_enum_1 = require("../services/feature.enum");
let MailController = class MailController {
    constructor(service) {
        this.service = service;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                user: {
                    name: 'Aditia Prasetio',
                },
            };
            return this.service.send('aditia.prasetio@mavila.co.id', 'Forgot Password', data, feature_enum_1.EFeatureList.FORGOT_PASSWORD);
        });
    }
};
__decorate([
    common_1.Post('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MailController.prototype, "send", null);
MailController = __decorate([
    swagger_1.ApiUseTags('Mail'),
    common_1.Controller('mail'),
    swagger_1.ApiBearerAuth(),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailController);
exports.MailController = MailController;
//# sourceMappingURL=mail.controller.js.map