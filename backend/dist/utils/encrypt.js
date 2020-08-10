"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const uuid = require("uuid");
function encryptPassword(password) {
    return crypto.createHmac('sha256', password).digest('hex');
}
exports.encryptPassword = encryptPassword;
function generateToken() {
    const token = uuid.v4();
    return crypto.createHmac('sha256', token).digest('hex');
}
exports.generateToken = generateToken;
//# sourceMappingURL=encrypt.js.map