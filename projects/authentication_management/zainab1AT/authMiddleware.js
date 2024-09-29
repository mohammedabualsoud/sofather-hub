
import DAL from "./DAL.js";
import { getConnection } from "./mysql.js";
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

        req.auth = { username, password};
        next();
}