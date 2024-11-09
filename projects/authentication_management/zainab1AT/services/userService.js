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


export default { registerUser };
