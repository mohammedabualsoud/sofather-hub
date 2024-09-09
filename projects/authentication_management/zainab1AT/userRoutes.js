import express from "express";
import { getConnection } from "./mysql.js";
import DAL from "./DAL.js";
import { verifyToken } from "./authMiddleware.js";
const router = express.Router();
const con = getConnection();
const DALInstance = new DAL(con);

export async function isValidPassword(pass, hashPass) {
  return await bcrypt.compare(pass, hashPass);
}

router.get("/all", async (req, res) => {
  const { username,password } = req.params; 
  console.log('Username:', username);
  try {
    const user = await DALInstance.findByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await isValidPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed: Invalid password" });
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
