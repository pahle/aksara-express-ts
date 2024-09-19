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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jose_1 = require("jose");
const validation_1 = require("../../utils/validation");
const prisma = new client_1.PrismaClient();
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, password } = req.body;
        const errors = {};
        if (!address)
            errors.addressError = "Address is required";
        if (!password)
            errors.passwordError = "Password is required";
        if (address &&
            !(0, validation_1.isValidEmail)(address) &&
            !(0, validation_1.isValidPhone)(address)) {
            errors.addressError = "Invalid email or phone format";
        }
        if (password && !(0, validation_1.isValidPassword)(password)) {
            errors.passwordError = "Invalid password format";
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).send({
                status: "error",
                code: 400,
                data: {
                    address,
                    password,
                },
                message: errors,
            });
        }
        const user = yield prisma.user.findFirst({
            where: {
                OR: [{ email: address }, { phone: address }],
            },
        });
        if (!user) {
            return res.status(404).send({
                status: "error",
                code: 404,
                data: { address },
                message: { addressError: "User not found" },
            });
        }
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({
                status: "error",
                code: 400,
                data: { password },
                message: { passwordError: "Password is incorrect" },
            });
        }
        if (user.verifiedAt === null) {
            return res.status(400).send({
                status: "error",
                code: 400,
                data: { address },
                message: { addressError: "User not verified" },
            });
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const jwt = yield new jose_1.SignJWT({
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
            },
        })
            .setProtectedHeader({ alg: process.env.JWT_ALGORITHM || "" })
            .setIssuedAt()
            .setExpirationTime("30m")
            .sign(secret);
        res.status(200).json({
            status: "success",
            code: 200,
            data: { jwt },
            message: "Successfully signed in",
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
exports.signIn = signIn;
//# sourceMappingURL=signIn.controller.js.map