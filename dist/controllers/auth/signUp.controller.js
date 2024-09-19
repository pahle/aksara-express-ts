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
exports.signUp = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validation_1 = require("../../utils/validation");
const prisma = new client_1.PrismaClient();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone, password } = req.body;
        const errors = {};
        if (!email)
            errors.emailError = "Email is required";
        if (!phone)
            errors.phoneError = "Phone is required";
        if (!password)
            errors.passwordError = "Password is required";
        if (email && !(0, validation_1.isValidEmail)(email))
            errors.emailError = "Invalid email format";
        if (phone && !(0, validation_1.isValidPhone)(phone))
            errors.phoneError = "Invalid phone format";
        if (password && !(0, validation_1.isValidPassword)(password))
            errors.passwordError =
                "Password must contain at least 8 characters, 1 uppercase letter, and 1 number";
        if (Object.keys(errors).length > 0) {
            return res.status(400).send({
                status: "error",
                code: 400,
                data: {
                    email,
                    phone,
                    password,
                },
                message: errors,
            });
        }
        const existingUser = yield prisma.user.findFirst({
            where: {
                OR: [{ email }, { phone }],
            },
        });
        if (existingUser) {
            return res.status(400).send({
                status: "error",
                code: 400,
                data: { email, phone },
                message: "User already exists with this email or phone",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        let random = Math.floor(Math.random() * 1000);
        let username = email.split("@")[0] + random;
        let checkUsername = yield prisma.profile.findFirst({
            where: {
                username: username,
            },
        });
        while (checkUsername) {
            random = Math.floor(Math.random() * 1000);
            username = email.split("@")[0] + random;
            checkUsername = yield prisma.profile.findFirst({
                where: {
                    username: username,
                },
            });
        }
        const newUser = yield prisma.user.create({
            data: {
                email,
                phone,
                password: hashedPassword,
                profile: {
                    create: {
                        name: email.split("@")[0],
                        username: email.split("@")[0] + random,
                        bio: "Halo, saya baru disini!",
                    },
                },
            },
        });
        res.status(201).json({
            status: "success",
            code: 201,
            data: { newUser },
            message: "Successfully signed up",
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
exports.signUp = signUp;
//# sourceMappingURL=signUp.controller.js.map