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
const branch_entity_1 = require("../../../branch/branch.entity");
const BranchSeed_1 = require("./BranchSeed");
class CreateBranch {
    run(factory, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection
                .getRepository(branch_entity_1.Branch)
                .createQueryBuilder().delete().where('').execute();
            yield connection.createQueryBuilder().insert().into(branch_entity_1.Branch).values(BranchSeed_1.SeedData).execute();
        });
    }
}
exports.CreateBranch = CreateBranch;
//# sourceMappingURL=CreateBranch.seed.js.map