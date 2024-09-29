import express from "express";
import bcrypt from "bcrypt";
import DAL from "./DAL.js";
import { getConnection } from "./mysql.js";
const router = express.Router();
const con = getConnection();
const DALInstance = new DAL(con);
import basicAuth from "./authMiddleware.js";
import userService from "./userService.js";

router.post("/signup", basicAuth, async (req, res) => {
  const { username, password } = req.auth;
  const { email, role } = req.body;

  try {
    await userService.registerUser(username, password, email, role);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", basicAuth, async (req, res) => {
  const { username, password } = req.auth;

  try {
    await userService.authenticateUser(username, password);
    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

export default router;
