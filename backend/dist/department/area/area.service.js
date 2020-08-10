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
const crud_typeorm_1 = require("@nestjsx/crud-typeorm");
const typeorm_1 = require("@nestjs/typeorm");
const area_entity_1 = require("./area.entity");
const typeorm_2 = require("typeorm");
let AreaService = class AreaService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo) {
        super(repo);
    }
    findByName(names) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (names.length === 0) {
                    return Promise.reject({
                        statusCode: 400,
                        message: 'Area name must be an array of string',
                    });
                }
                const res = yield this.repo.find({
                    where: { name: typeorm_2.In(names) },
                });
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
AreaService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(area_entity_1.Area)),
    __metadata("design:paramtypes", [Object])
], AreaService);
exports.AreaService = AreaService;
//# sourceMappingURL=area.service.js.map