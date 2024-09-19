import express from "express";
import { createDestination, deleteDestination, getDestinations, updateDestination } from "../controllers/main/destinations.controller";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../controllers/main/events.controller";

const router = express.Router();

router.get("/destinations", getDestinations);
router.post("/destinations", createDestination);
router.patch("/destinations", updateDestination);
router.delete("/destinations", deleteDestination);

router.get("/events", getEvents);
router.post("/events", createEvent);
router.patch("/events", updateEvent);
router.delete("/events", deleteEvent);

export default router;
