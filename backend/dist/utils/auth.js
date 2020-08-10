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
const jwt = require("jsonwebtoken");
function getBranchId(authorization) {
    if (!authorization)
        return null;
    let token;
    const exp = authorization.split(' ');
    if (exp && exp.length > 0) {
        token = exp[1];
    }
    else {
        return null;
    }
    const account = jwt.decode(token);
    return account.branch_id;
}
exports.getBranchId = getBranchId;
function getAccountId(authorization) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!authorization)
            return null;
        let token;
        const exp = yield authorization.split(' ');
        if (exp && exp.length > 0) {
            token = exp[1];
        }
        else {
            return null;
        }
        const account = yield jwt.decode(token);
        return account.id;
    });
}
exports.getAccountId = getAccountId;
function getUserRole(authorization) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!authorization)
            return null;
        let token;
        const exp = yield authorization.split(' ');
        if (exp && exp.length > 0) {
            token = exp[1];
        }
        else {
            return null;
        }
        const account = yield jwt.decode(token);
        return account.roles[0];
    });
}
exports.getUserRole = getUserRole;
//# sourceMappingURL=auth.js.map