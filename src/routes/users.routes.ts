import express from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/users/users.controller";

const router = express.Router();

router.get("/users", getUsers);
router.patch("/users", updateUser);
router.delete("/users", deleteUser);

export default router;
