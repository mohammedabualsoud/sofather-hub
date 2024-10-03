import express from "express";
import {verifyToken} from "./authMiddleware.js";
import userService from "./userService.js";

const router = express.Router();

router.get("/all",verifyToken, async (req, res) => {
  const username = req.username; 
  try {
  const users = await userService.allUsers(username);
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

export default router;
