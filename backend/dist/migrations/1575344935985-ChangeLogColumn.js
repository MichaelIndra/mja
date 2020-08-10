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
class ChangeLogColumn1575344935985 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('DROP INDEX `IDX_874897ac4b6729a705ff40f126` ON `logs`', undefined);
            yield queryRunner.query('DROP INDEX `IDX_807abb1f01d751e24c2a5fda8e` ON `logs`', undefined);
            yield queryRunner.query('ALTER TABLE `logs` CHANGE `entity` `entity` varchar(50) NOT NULL', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `logs` CHANGE `entity` `entity` varchar(20) NOT NULL', undefined);
            yield queryRunner.query('CREATE UNIQUE INDEX `IDX_807abb1f01d751e24c2a5fda8e` ON `logs` (`action`)', undefined);
            yield queryRunner.query('CREATE UNIQUE INDEX `IDX_874897ac4b6729a705ff40f126` ON `logs` (`entity`)', undefined);
        });
    }
}
exports.ChangeLogColumn1575344935985 = ChangeLogColumn1575344935985;
//# sourceMappingURL=1575344935985-ChangeLogColumn.js.map