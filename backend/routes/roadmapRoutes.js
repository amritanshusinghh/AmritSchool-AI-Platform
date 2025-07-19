import express from "express";
import { getRoadmap } from "../controllers/roadmapController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, getRoadmap);

export default router;
