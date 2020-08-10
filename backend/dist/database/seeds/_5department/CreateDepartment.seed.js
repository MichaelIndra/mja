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
const DepartmentSeed_1 = require("./DepartmentSeed");
const department_entity_1 = require("../../../department/department.entity");
class CreateDepartment {
    run(factory, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection
                .getRepository(department_entity_1.Department)
                .createQueryBuilder()
                .delete()
                .where('')
                .execute();
            yield connection
                .createQueryBuilder()
                .insert()
                .into(department_entity_1.Department)
                .values(DepartmentSeed_1.SeedData)
                .execute();
        });
    }
}
exports.CreateDepartment = CreateDepartment;
//# sourceMappingURL=CreateDepartment.seed.js.map