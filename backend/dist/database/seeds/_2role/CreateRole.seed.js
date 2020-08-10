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
const RoleSeed_1 = require("./RoleSeed");
const role_entity_1 = require("../../../auth/role/role.entity");
class CreateRole {
    run(factory, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection
                .getRepository(role_entity_1.Role)
                .createQueryBuilder()
                .delete()
                .where('')
                .execute();
            yield connection
                .createQueryBuilder()
                .insert()
                .into(role_entity_1.Role)
                .values(RoleSeed_1.SeedData)
                .execute();
        });
    }
}
exports.CreateRole = CreateRole;
//# sourceMappingURL=CreateRole.seed.js.map