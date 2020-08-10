"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const request_service_1 = require("./request.service");
const request_controller_1 = require("./request.controller");
const typeorm_1 = require("@nestjs/typeorm");
const request_entity_1 = require("./request.entity");
let RequestModule = class RequestModule {
};
RequestModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([request_entity_1.Request])],
        providers: [request_service_1.RequestService],
        controllers: [request_controller_1.RequestController],
    })
], RequestModule);
exports.RequestModule = RequestModule;
//# sourceMappingURL=request.module.js.map