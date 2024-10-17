import express from "express";
import basicAuth from "../middlewares/authMiddleware.js";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", basicAuth, login);
router.post("/users", basicAuth, allUsers);

export default router;

