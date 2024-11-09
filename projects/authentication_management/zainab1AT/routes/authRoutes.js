import express from "express";
import basicAuth from "../middlewares/authMiddleware.js";
import { signup, login , allUsers} from "../controllers/authController.js";
import verifyToken from "../middlewares/jwtAuth.js"
const router = express.Router();

router.post("/signup", signup);
router.post("/login", basicAuth, login);
router.post("/users", verifyToken, allUsers);

export default router;

