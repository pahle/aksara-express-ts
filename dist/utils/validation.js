"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPassword = exports.isValidPhone = exports.isValidEmail = void 0;
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidPhone = (phone) => {
    return /^62\d{9,12}$/.test(phone);
};
exports.isValidPhone = isValidPhone;
const isValidPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
};
exports.isValidPassword = isValidPassword;
//# sourceMappingURL=validation.js.map