import { con, connectToDatabase } from "./mysql.js";

export default class BudgetManagementService {
  async getUserByUsername(userName) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM USER WHERE username = ?`;
      con.query(query, [userName], function (err, results) {
        if (err) throw err;
        if (results.length > 0) resolve(results[0]);
        resolve("user not found");
      });
    });
  }
  // error: when I add user already exist it print "added successfully " in App.js
  async addUser(userName, firstName, lastName) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM USER WHERE username = ?`;
      con.query(query, [userName], function (err, results) {
        if (err) return reject(err);
        if (results.length > 0) return resolve("The user already exists!");
        const query = `INSERT INTO USER (username,firstName,lastName) values(?,?,?)`;
        con.query(
          query,
          [userName, firstName, lastName],
          function (err, results) {
            if (err) throw err;
            resolve("User added successfully....");
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
        if (results.length === 0) return reject("User not found!");
        if (amount <= 0) return reject("Insufficient amount!");
        const updateQuery = `UPDATE USER SET balance = balance + ? WHERE username = ?`;
        con.query(updateQuery, [amount, username], function (err, results) {
          if (err) return reject(err);
          resolve(`Deposit successful!`);
        });
      });
    });
  }
  transfer(senderUsername, receiverUsername, amount) {
    return new Promise((resolve, reject) => {
      const senderQuery = `SELECT * FROM USER WHERE username = ?`;
      con.query(senderQuery, [senderUsername], (req, results) => {
        if (results.length === 0) return reject("Sender not found!");
        const receiverQuery = `SELECT * FROM USER WHERE username = ?`;
        con.query(receiverQuery, [receiverUsername], (req, results) => {
          if (results.length === 0) return reject("Receiver not found!");
          if (amount <= 0) return reject("Insufficient amount!");
          const senderBalanceQuery = `SELECT balance FROM USER WHERE username = ?`;
          con.query(senderBalanceQuery, [senderUsername], (req, results) => {
            // if (results.length === 0) return reject("Sender not found!");
            const senderBalance = results[0].balance;
            if (senderBalance < amount) return reject("Insufficient balance!");
            const updateSenderQuery = `UPDATE USER SET balance = balance - ? WHERE username = ?`;
            con.query(
              updateSenderQuery,
              [amount, senderUsername],
              (req, results) => {
                const updateReceiverQuery = `UPDATE USER SET balance = balance + ? WHERE username = ?`;
                con.query(
                  updateReceiverQuery,
                  [amount, receiverUsername],
                  (req, results) => {
                    return resolve(`Transfer successful!`);
                  }
                );
              }
            );
          });
        });
      });
    });
  }
}
