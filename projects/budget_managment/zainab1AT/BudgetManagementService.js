import { con, connectToDatabase } from "./mysql.js";

export default class BudgetManagementService {
  async getUserByUsername(userName) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM USER WHERE username = ?`;
      con.query(query, [userName], function (err, results) {
        if (err) throw err;
        if (results.length > 0) resolve(results[0]);
        else {
          console.log("User not found.");
          resolve(undefined);
        }
      });
    });
  }

  async addUser(userName, firstName, lastName) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM USER WHERE username = ?`;
      con.query(query, [userName], function (err, results) {
        if (err) reject(err);
        if (results.length > 0) return resolve("The user already exists!");

        const query = `INSERT INTO USER (username,firstName,lastName) values(?,?,?)`;
        con.query(
          query,
          [userName, firstName, lastName],
          function (err, results) {
            if (err) return reject(err);
            resolve("User added successfully.");
          }
        );
      });
    });
  }

  deposit(username, amount) {
    return new Promise(function (resolve, reject) {

      const checkQuery = `SELECT * FROM USER WHERE username = ?`;
      con.query(checkQuery, [username], function (err, results) {

        if (err) return reject(err);
        if (results.length === 0) return reject('User not found!'); 
        else{
        const updateQuery = `UPDATE USER SET balance = balance + ? WHERE username = ?`;
        con.query(updateQuery, [amount, username], function (err, results) {
          if (err) return reject(err);
          resolve(`Deposit successful!`);
        });

      }
      });
    });
  }

}
