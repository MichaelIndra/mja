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
class ChangeUniqueDepartmentAndBranchName1572559196742 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('DROP INDEX `IDX_8681da666ad9699d568b3e9106` ON `departments`', undefined);
            yield queryRunner.query('ALTER TABLE `branchs` ADD UNIQUE INDEX `IDX_9553b92c0e363ae6c45f4e3125` (`name`)', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `branchs` DROP INDEX `IDX_9553b92c0e363ae6c45f4e3125`', undefined);
            yield queryRunner.query('CREATE UNIQUE INDEX `IDX_8681da666ad9699d568b3e9106` ON `departments` (`name`)', undefined);
        });
    }
}
exports.ChangeUniqueDepartmentAndBranchName1572559196742 = ChangeUniqueDepartmentAndBranchName1572559196742;
//# sourceMappingURL=1572559196742-ChangeUniqueDepartmentAndBranchName.js.map