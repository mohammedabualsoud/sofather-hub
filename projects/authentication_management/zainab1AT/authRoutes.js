import express from "express";
import bcrypt from "bcrypt";
import DAL from "./DAL.js";
import { getConnection } from "./mysql.js";

const router = express.Router();
const con = getConnection();
const DALInstance = new DAL(con);

router.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const user = await DALInstance.findByUsername(username);
    if (!user) {
      await DALInstance.addUser(username, email, hashedPassword, role);
      res.status(201).json({ message: "User registered successfully" });
    } else res.status(500).json({ message: "Registration faild" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await DALInstance.findByUsername(username);
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match)
        res.status(200).json({ message: "User logged in successfully" });
      else res.status(401).json({ message: "Invalid username or password" });
    } else res.status(401).json({ message: "Invalid username or password" });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
