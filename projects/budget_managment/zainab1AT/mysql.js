import mysql from "mysql";
import util from "util";
import dotenv from 'dotenv';

dotenv.config(); 
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

con.query = util.promisify(con.query).bind(con);

con.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
  console.log("MySQL Connected");
});

export { con };
