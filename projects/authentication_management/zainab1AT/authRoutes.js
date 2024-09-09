import express from "express";
import bcrypt from "bcrypt";
import DAL from "./DAL.js";
import { getConnection } from "./mysql.js";
const router = express.Router();
const con = getConnection();
const DALInstance = new DAL(con);

export async function isValidPassword(pass, hashPass) {
  return await bcrypt.compare(pass, hashPass);
}

router.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    await DALInstance.addUser(username, email, hashedPassword, role);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await DALInstance.findByUsername(username);
    if (!user) {
      res.status(401).json({ error: "Authentication failed" });
      return;
    }

    if (!isValidPassword(password, user.password)) {
      res.status(401).json({ error: "Authentication failed" });
      return;
    }

    res.status(200).json({message:"Login successful"});
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
