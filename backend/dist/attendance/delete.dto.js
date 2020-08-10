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
class DeleteManyDto {
}
__decorate([
    swagger_1.ApiModelProperty({ example: false }),
    __metadata("design:type", Boolean)
], DeleteManyDto.prototype, "isAllSelected", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", Array)
], DeleteManyDto.prototype, "ids", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", String)
], DeleteManyDto.prototype, "query", void 0);
exports.DeleteManyDto = DeleteManyDto;
//# sourceMappingURL=delete.dto.js.map