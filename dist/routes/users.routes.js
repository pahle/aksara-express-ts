"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("../controllers/users/users.controller");
const profile_controller_1 = require("../controllers/users/profile.controller");
const router = express_1.default.Router();
router.get("/users", users_controller_1.getUsers);
router.patch("/users", users_controller_1.updateUser);
router.delete("/users", users_controller_1.deleteUser);
router.get("/users/profile", profile_controller_1.getProfile);
router.patch("/users/profile", profile_controller_1.updateProfile);
exports.default = router;
//# sourceMappingURL=users.routes.js.map