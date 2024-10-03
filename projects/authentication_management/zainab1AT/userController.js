import express from "express";
import dotenv from 'dotenv'; 
const router = express.Router();
import {basicAuth} from "./authMiddleware.js";
import userService from "./userService.js";
import jwt from 'jsonwebtoken';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

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
    const token = jwt.sign({username: username,},SECRET,{expiresIn:'24h'});
   
    res.status(200).json({Token: token, message: "User logged in successfully" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

export default router;
