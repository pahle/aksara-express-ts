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
exports.updateProfile = exports.getProfile = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString();
        if (!userId) {
            return res.status(400).send({
                status: "error",
                code: 400,
                message: "User ID is required",
            });
        }
        const user = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                profile: true,
            },
        });
        if (!user) {
            return res.status(404).send({
                status: "error",
                code: 404,
                message: "User not found",
            });
        }
        res.status(200).json({
            status: "success",
            code: 200,
            data: { user },
            message: "User found",
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
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, username, name, bio } = req.body;
        const exsistingUser = yield prisma.user.findFirst({
            where: {
                profile: {
                    username: username,
                    name: name,
                }
            }
        });
        if (exsistingUser) {
            return res.status(400).send({
                status: "error",
                code: 400,
                message: "Username or name already exists",
            });
        }
        const updatedUser = yield prisma.user.update({
            where: {
                id,
            },
            data: {
                profile: {
                    update: {
                        username,
                        name,
                        bio,
                    },
                },
            },
            include: {
                profile: true,
            },
        });
        res.status(200).json({
            status: "success",
            code: 200,
            data: { user: updatedUser },
            message: "User updated"
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
exports.updateProfile = updateProfile;
//# sourceMappingURL=profile.controller.js.map