"use strict";
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
const AreaSeed_1 = require("./AreaSeed");
const area_entity_1 = require("../../../department/area/area.entity");
class CreateArea {
    run(factory, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection
                .getRepository(area_entity_1.Area)
                .createQueryBuilder()
                .delete()
                .where('')
                .execute();
            yield connection
                .createQueryBuilder()
                .insert()
                .into(area_entity_1.Area)
                .values(AreaSeed_1.SeedData)
                .execute();
        });
    }
}
exports.CreateArea = CreateArea;
//# sourceMappingURL=CreateArea.seed.js.map