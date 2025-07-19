import express from "express";
import { register, verifyUser, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyUser);
router.post("/login", login);

export default router;
