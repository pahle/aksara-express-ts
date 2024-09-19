"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const destinations_controller_1 = require("../controllers/main/destinations.controller");
const events_controller_1 = require("../controllers/main/events.controller");
const router = express_1.default.Router();
router.get("/destinations", destinations_controller_1.getDestinations);
router.post("/destinations", destinations_controller_1.createDestination);
router.patch("/destinations", destinations_controller_1.updateDestination);
router.delete("/destinations", destinations_controller_1.deleteDestination);
router.get("/events", events_controller_1.getEvents);
router.post("/events", events_controller_1.createEvent);
router.patch("/events", events_controller_1.updateEvent);
router.delete("/events", events_controller_1.deleteEvent);
exports.default = router;
//# sourceMappingURL=main.routes.js.map