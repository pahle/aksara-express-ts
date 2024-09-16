import express from "express";
import { signIn } from "../controllers/auth/signIn.controller";
import { signUp } from "../controllers/auth/signUp.controller";
import {
  createOtp,
  verifyOtp,
} from "../controllers/auth/otp.controller";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/otp", createOtp);
router.post("/otp/verify", verifyOtp);

export default router;
