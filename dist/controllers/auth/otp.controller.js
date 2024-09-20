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
exports.verifyOtp = exports.createOtp = void 0;
const client_1 = require("@prisma/client");
const validation_1 = require("../../utils/validation");
const mailer_1 = require("../../utils/mailer");
const prisma = new client_1.PrismaClient();
const createOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, createdFor } = req.body;
        const errors = {};
        if (!address)
            errors.addressError = "Address is required";
        if (!createdFor)
            errors.createdForError = "Created for is required";
        if (address &&
            !(0, validation_1.isValidEmail)(address) &&
            !(0, validation_1.isValidPhone)(address)) {
            errors.addressError = "Invalid email or phone format";
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).send({
                status: "error",
                code: 400,
                data: {
                    address,
                    createdFor,
                },
                message: errors,
            });
        }
        const sentTo = (0, validation_1.isValidEmail)(address)
            ? "email"
            : "phone";
        if (sentTo === "email") {
            const user = yield prisma.user.findFirst({
                where: {
                    email: address,
                },
                include: {
                    otp: true,
                },
            });
            if (!user) {
                return res.status(404).send({
                    status: "error",
                    code: 404,
                    data: {
                        address,
                    },
                    message: { addressError: "User not found" },
                });
            }
            if (user.otp) {
                if (user.otp.validUntil > new Date()) {
                    return res.status(400).send({
                        status: "error",
                        code: 400,
                        data: {
                            address,
                        },
                        message: "OTP already exists",
                    });
                }
                yield prisma.otp.delete({
                    where: {
                        id: user.otp.id,
                    },
                });
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const updatedUser = yield prisma.user.update({
                where: { email: address },
                data: {
                    otp: {
                        create: {
                            code: otp,
                            createdFor: createdFor,
                            validUntil: new Date(Date.now() + 5 * 60 * 1000), // Set validUntil property to 5 minutes from now
                            sentTo: sentTo,
                        },
                    },
                },
            });
            yield (0, mailer_1.sendOtpToEmail)(address, otp);
            res.status(200).json({
                status: "success",
                code: 200,
                data: { email: updatedUser.email },
                message: "OTP sent to email",
            });
        }
        if (sentTo === "phone") {
            // not supported
            res.status(400).send({
                status: "error",
                code: 400,
                data: {
                    address,
                },
                message: "Phone number not supported",
            });
        }
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Internal server error: " + error.message,
        });
    }
});
exports.createOtp = createOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, code } = req.body;
        const errors = {};
        if (!address)
            errors.addressError = "Address is required";
        if (!code)
            errors.codeError = "Code is required";
        if (address &&
            !(0, validation_1.isValidEmail)(address) &&
            !(0, validation_1.isValidPhone)(address)) {
            errors.addressError = "Invalid email or phone format";
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).send({
                status: "error",
                code: 400,
                data: {
                    address,
                    code,
                },
                message: errors,
            });
        }
        const user = yield prisma.user.findFirst({
            where: {
                email: address,
            },
            include: {
                otp: true,
            },
        });
        if (!user) {
            return res.status(404).send({
                status: "error",
                code: 404,
                data: {
                    address,
                },
                message: { addressError: "User not found" },
            });
        }
        if (!user.otp) {
            return res.status(404).send({
                status: "error",
                code: 404,
                data: {
                    address,
                },
                message: {
                    codeError: "OTP not found",
                }
            });
        }
        if (user.otp.code !== code) {
            return res.status(400).send({
                status: "error",
                code: 400,
                data: {
                    address,
                    code,
                },
                message: {
                    codeError: "Invalid OTP",
                }
            });
        }
        if (user.otp.validUntil < new Date()) {
            return res.status(400).send({
                status: "error",
                code: 400,
                data: {
                    address,
                },
                message: {
                    codeError: "OTP expired",
                },
            });
        }
        yield prisma.user.update({
            where: {
                email: address,
            },
            data: {
                verifiedAt: new Date(),
                otp: {
                    delete: true,
                },
            },
        });
        res.status(200).json({
            status: "success",
            code: 200,
            data: { email: user.email },
            message: "OTP verified",
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
exports.verifyOtp = verifyOtp;
//# sourceMappingURL=otp.controller.js.map