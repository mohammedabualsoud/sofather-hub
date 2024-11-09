import { getConnection } from "../config/mysql.js";
import jwt from "jsonwebtoken";

const con = getConnection();
const SECRET = process.env.JWT_SECRET;

export default async function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.username = decoded.username;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
