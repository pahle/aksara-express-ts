import express from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/users/users.controller";
import { getProfile, updateProfile } from "../controllers/users/profile.controller";

const router = express.Router();

router.get("/users", getUsers);
router.patch("/users", updateUser);
router.delete("/users", deleteUser);
router.get("/users/profile", getProfile);
router.patch("/users/profile", updateProfile);

export default router;
