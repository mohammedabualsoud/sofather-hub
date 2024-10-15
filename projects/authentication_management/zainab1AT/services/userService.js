import bcrypt from "bcrypt";
import DAL from "../config/DAL.js";
import { getConnection } from "../config/mysql.js";

const con = getConnection();
const DALInstance = new DAL(con);

const registerUser = async (username, password, email, role) => {
  const user = await DALInstance.findByUsername(username);
  
  if (user) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await DALInstance.addUser(username, email, hashedPassword, role);
};

async function isPasswordValid(pass, hashPass) {
    return await bcrypt.compare(pass, hashPass);
  }


  const allUsers = async (username, password) => {

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
    
        return await DALInstance.allUsers();
     
  };

export default { registerUser, allUsers };
