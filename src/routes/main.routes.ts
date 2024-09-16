import express from "express";
import { getDestinations } from "../controllers/main/destinations.controller";

const router = express.Router();

router.get("/destinations", getDestinations);

export default router;
