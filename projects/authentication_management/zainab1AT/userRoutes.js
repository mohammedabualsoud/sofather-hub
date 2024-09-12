import express from "express";
import bcrypt from "bcrypt";
import { getConnection } from "./mysql.js";
import DAL from "./DAL.js";
import basicAuth from "./authMiddleware.js";

const router = express.Router();
const con = getConnection();
const DALInstance = new DAL(con);

async function isPasswordValid(pass, hashPass) {
  return await bcrypt.compare(pass, hashPass);
}
router.post("/all",basicAuth, async (req, res) => {
  const { username, password } = req.auth;

  try {
    const user = await DALInstance.findByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!isPasswordValid(password, user.password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const allUsers = await DALInstance.allUsers();
    return res.status(200).json({ users: allUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
