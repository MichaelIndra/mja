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
class AddColumnSwitchableToGroup1576655997195 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `groups` ADD `switchable` tinyint NOT NULL DEFAULT 0', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('ALTER TABLE `groups` DROP COLUMN `switchable`', undefined);
        });
    }
}
exports.AddColumnSwitchableToGroup1576655997195 = AddColumnSwitchableToGroup1576655997195;
//# sourceMappingURL=1576655997195-AddColumnSwitchableToGroup.js.map