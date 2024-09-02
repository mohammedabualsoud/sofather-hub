import express from "express";
import dotenv from "dotenv";
import DAL from "./DAL.js";
import { getConnection } from "./mysql.js";
import bcrypt from 'bcrypt';

const app = express();
const con = getConnection();
const DALInstance = new DAL(con);

dotenv.config();

const PORT = process.env.PORT;
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try{
    await DALInstance.addUser(username, email, hashedPassword, role);
    res.status(201).json({ message: 'User registered successfully' });
  }catch(error){
    res.status(500).json({ error: 'Registration failed' });
  }

});

app.post("/login", async (req, res) => {
    const { username, password} = req.body;
    const user = await DALInstance.findByUsername(username);
    const match = await bcrypt.compare(password,user.password);
    if(user && match){
        res.status(200).json({message: 'User logged in successfully'});
    }
    else{
        res.status(401).json({message: 'Invalid username or password'});
    }
  });
