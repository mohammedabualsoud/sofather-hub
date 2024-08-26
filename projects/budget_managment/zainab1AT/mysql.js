import mysql from "mysql";
import util from "util";

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "budgetmanagement_db",
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
