
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

  async function basicAuth(req, res, next) {

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

 async function verifyToken(req, res, next) {

  const authHeader  = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.username = decoded.username;
    next();
    } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    }
    };
    
    export { basicAuth, verifyToken};
