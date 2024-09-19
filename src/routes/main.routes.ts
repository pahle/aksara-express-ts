import express from "express";
import { createDestination, deleteDestination, getDestinations, updateDestination } from "../controllers/main/destinations.controller";
import { getEvents } from "../controllers/main/events.controller";

const router = express.Router();

router.get("/destinations", getDestinations);
router.post("/destinations", createDestination);
router.patch("/destinations", updateDestination);
router.delete("/destinations", deleteDestination);

router.get("/events", getEvents);
router.post("/events", createDestination);
router.patch("/events", updateDestination);
router.delete("/events", deleteDestination);


export default router;
