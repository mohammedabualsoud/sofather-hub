import { con } from "./mysql.js";

export default class BudgetManagementService {
  async getUserByUsername(userName) {
    try {
      const results = await con.query(`SELECT * FROM USER WHERE username = ?`, [
        userName,
      ]);
      if (results.length > 0) return results[0];

      return null;
    } catch (err) {
      console.error(err);
    }
  }

  async addUser(userName, firstName, lastName) {
    try {
      const selectresults = await con.query(`SELECT * FROM USER WHERE username = ?`, [
        userName,
      ]);
      if (selectresults.length > 0) {
        return selectresults[0];
      } else {
        const results = await con.query(
          `INSERT INTO USER (username, firstName, lastName) VALUES (?, ?, ?)`,
          [userName, firstName, lastName]
        );
        const newUser = await con.query(`SELECT * FROM USER WHERE username = ?`, [userName]);
        return newUser[0];
      }
    } catch (err) {
      console.error(err);
    }
  }

  async deposit(username, amount) {
    try {
      const results = await con.query(`SELECT * FROM USER WHERE username = ?`, [
        username,
      ]);
      if (results.length === 0) {
        throw new Error("User not found!");
      }
      if (amount <= 0) {
        throw new Error("Insufficient amount!");
      }
      await con.query(
        `UPDATE USER SET balance = balance + ? WHERE username = ?`,
        [amount, username]
      );

    } catch (err) {
      // console.error(err);
      throw err;
    }
  }

  async transfer(senderUsername, receiverUsername, amount) {
    try {
      const senderResults = await con.query(
        `SELECT * FROM USER WHERE username = ?`,
        [senderUsername]
      );
      if (senderResults.length === 0) {
        throw new Error("Sender not found!");
      }

      const receiverResults = await con.query(
        `SELECT * FROM USER WHERE username = ?`,
        [receiverUsername]
      );
      if (receiverResults.length === 0) {
        throw new Error("Receiver not found!");
      }

      if (amount <= 0) {
        throw new Error("Insufficient amount!");
      }

      const senderBalanceResults = await con.query(
        `SELECT balance FROM USER WHERE username = ?`,
        [senderUsername]
      );
      const senderBalance = senderBalanceResults[0].balance;

      if (senderBalance < amount) {
        throw new Error("Insufficient balance!");
      }

      await con.query(
        `UPDATE USER SET balance = balance - ? WHERE username = ?`,
        [amount, senderUsername]
      );
      await con.query(
        `UPDATE USER SET balance = balance + ? WHERE username = ?`,
        [amount, receiverUsername]
      );
    } catch (err) {
      // console.error(err);
      throw err;
    }
  }
}
