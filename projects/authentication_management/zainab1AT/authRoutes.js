import express from "express";
import bcrypt from "bcrypt";
import { getConnection } from "./mysql.js";
import DAL from "./DAL.js";
import basicAuth from "./authMiddleware.js";
import userService from "./userService.js";

const router = express.Router();
const con = getConnection();
const DALInstance = new DAL(con);


router.get("/all",basicAuth, async (req, res) => {
  const { username, password } = req.auth;

  try {
  const users = await userService.allUsers(username, password);
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

export default router;
