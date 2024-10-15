
import DAL from "../config/DAL.js";
import { getConnection } from "../config/mysql.js";
import bcrypt from "bcrypt";

const con = getConnection();
const DALInstance = new DAL(con);

export default async function basicAuth(req, res, next) {

    const authHeader = req.headers.authorization; 

    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return res.status(401).json({ message: "Authorization header missing or invalid" });
      }

      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
      const [username, password] = credentials.split(":");
    
      if (!username || !password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

    req.auth = { username, password };

    if (req.method === 'POST' && req.path === '/login') {
        const user = await DALInstance.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        req.user = user;
    }

    next();
}

