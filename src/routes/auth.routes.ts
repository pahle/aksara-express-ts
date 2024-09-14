import express from "express";
import { signIn } from "../controllers/signIn.controller";
import { signUp } from "../controllers/signUp.controller";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);

export default router;
