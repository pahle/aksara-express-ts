"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signIn_controller_1 = require("../controllers/auth/signIn.controller");
const signUp_controller_1 = require("../controllers/auth/signUp.controller");
const otp_controller_1 = require("../controllers/auth/otp.controller");
const router = express_1.default.Router();
router.post("/signin", signIn_controller_1.signIn);
router.post("/signup", signUp_controller_1.signUp);
router.post("/otp", otp_controller_1.createOtp);
router.post("/otp/verify", otp_controller_1.verifyOtp);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map