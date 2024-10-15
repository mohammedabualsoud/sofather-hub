import express from "express";
import userService from "../services/userService.js";

const router = express.Router();

export const allUsers = async (req, res) => {
  const { username, password } = req.auth;

  try {
  const users = await userService.allUsers(username, password);
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};



export default router;
