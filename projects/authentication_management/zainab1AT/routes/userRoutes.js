import express from "express";
import basicAuth from "../middlewares/authMiddleware.js";
import { allUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/users", basicAuth, allUsers);

export default router;
