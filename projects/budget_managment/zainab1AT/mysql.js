import mysql from "mysql";

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "budgetmanagement_db",
});

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    con.connect(function (err) {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        return reject(err);
      }
      console.log("MySQL Connected");
      resolve(con);
    });
  });
}

export { con, connectToDatabase };

