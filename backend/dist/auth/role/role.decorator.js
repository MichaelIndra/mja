"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
exports.Roles = (...roles) => {
    return common_1.SetMetadata('roles', roles);
};
//# sourceMappingURL=role.decorator.js.map