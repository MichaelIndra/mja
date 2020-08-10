"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
exports.Permissions = (...permissions) => {
    return common_1.SetMetadata('permissions', permissions);
};
//# sourceMappingURL=permission.decorator.js.map