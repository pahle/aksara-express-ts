"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const destinations_controller_1 = require("../controllers/main/destinations.controller");
const router = express_1.default.Router();
router.get("/destinations", destinations_controller_1.getDestinations);
exports.default = router;
//# sourceMappingURL=main.routes.js.map