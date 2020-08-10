"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const rewardDeduction_service_1 = require("./rewardDeduction.service");
const rewardDeduction_controller_1 = require("./rewardDeduction.controller");
const typeorm_1 = require("@nestjs/typeorm");
const rewardDeduction_entity_1 = require("./rewardDeduction.entity");
let RewardDeductionModule = class RewardDeductionModule {
};
RewardDeductionModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([rewardDeduction_entity_1.RewardDeduction])],
        providers: [rewardDeduction_service_1.RewardDeductionService],
        controllers: [rewardDeduction_controller_1.RewardDeductionController],
    })
], RewardDeductionModule);
exports.RewardDeductionModule = RewardDeductionModule;
//# sourceMappingURL=rewardDeduction.module.js.map