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
exports.deleteUser = exports.updateUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const validation_1 = require("../../utils/validation");
const prisma = new client_1.PrismaClient();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString();
        if (userId) {
            const user = yield prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                return res.status(404).send({
                    status: "error",
                    code: 404,
                    message: "User not found",
                });
            }
            return res.status(200).send({
                status: "success",
                code: 200,
                data: { user },
                message: "User found",
            });
        }
        const users = yield prisma.user.findMany();
        if (!users || users.length === 0) {
            return res.status(404).send({
                status: "error",
                code: 404,
                message: "No user found",
            });
        }
        res.status(200).json({
            status: "success",
            code: 200,
            data: { users },
            message: "Users found",
        });
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Internal server error: " + error.message,
        });
    }
});
exports.getUsers = getUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, email, phone, password } = req.body;
        const errors = {};
        if (!id)
            errors.idError = "ID is required";
        if (email && !(0, validation_1.isValidEmail)(email))
            errors.emailError = "Invalid email format";
        if (phone && !(0, validation_1.isValidPhone)(phone))
            errors.phoneError = "Invalid phone format";
        if (password && !(0, validation_1.isValidPassword)(password))
            errors.passwordError = "Invalid password format";
        if (Object.keys(errors).length > 0) {
            return res.status(400).send({
                status: "error",
                code: 400,
                data: {
                    id,
                    email,
                    phone,
                    password,
                },
                message: errors,
            });
        }
        const user = yield prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            return res.status(404).send({
                status: "error",
                code: 404,
                message: "User not found",
            });
        }
        const updatedUser = yield prisma.user.update({
            where: {
                id,
            },
            data: {
                email,
                phone,
                password,
            },
        });
        res.status(200).json({
            status: "success",
            code: 200,
            data: { user: updatedUser },
            message: "User updated",
        });
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Internal server error: " + error.message,
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send({
                status: "error",
                code: 400,
                message: "ID is required",
            });
        }
        const user = yield prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            return res.status(404).send({
                status: "error",
                code: 404,
                message: "User not found",
            });
        }
        yield prisma.user.delete({
            where: {
                id,
            },
        });
        res.status(200).json({
            status: "success",
            code: 200,
            message: "User deleted",
        });
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Internal server error: " + error.message,
        });
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=users.controller.js.map