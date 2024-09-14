import express from "express";
import { signIn } from "../controllers/signIn.controller";
import { signUp } from "../controllers/signUp.controller";
import {
  createOtp,
  verifyOtp,
} from "../controllers/otp.controller";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/otp", createOtp);
router.post("/otp/verify", verifyOtp);

export default router;
