import express from "express";
import basicAuth from "../middlewares/authMiddleware.js";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", basicAuth, signup);
router.post("/login", basicAuth, login);

export default router;

