import { con } from "./mysql.js";
import { promisify } from "util";

const query = promisify(con.query).bind(con); 

export default class BudgetManagementService {
  async getUserByUsername(userName) {
    try {
      const results = await query(`SELECT * FROM USER WHERE username = ?`, [
        userName,
      ]);
      if (results.length > 0) {
        return results[0];
      } else {
        return "User not found";
      }
    } catch (err) {
      throw err;
    }
  }

  async addUser(userName, firstName, lastName) {
    try {
      const results = await query(`SELECT * FROM USER WHERE username = ?`, [
        userName,
      ]);
      if (results.length > 0) {
        return "The user already exists!";
      } else {
        await query(
          `INSERT INTO USER (username, firstName, lastName) VALUES (?, ?, ?)`,
          [userName, firstName, lastName]
        );
        return "User added successfully.";
      }
    } catch (err) {
      throw err;
    }
  }

  async deposit(username, amount) {
    try {
      const results = await query(`SELECT * FROM USER WHERE username = ?`, [
        username,
      ]);
      if (results.length === 0) {
        throw new Error("User not found!");
      }
      if (amount <= 0) {
        throw new Error("Insufficient amount!");
      }
      await query(`UPDATE USER SET balance = balance + ? WHERE username = ?`, [
        amount,
        username,
      ]);
      return "Deposit successful!";
    } catch (err) {
      throw err;
    }
  }

  async transfer(senderUsername, receiverUsername, amount) {
    try {
      const senderResults = await query(
        `SELECT * FROM USER WHERE username = ?`,
        [senderUsername]
      );
      if (senderResults.length === 0) {
        throw new Error("Sender not found!");
      }

      const receiverResults = await query(
        `SELECT * FROM USER WHERE username = ?`,
        [receiverUsername]
      );
      if (receiverResults.length === 0) {
        throw new Error("Receiver not found!");
      }

      if (amount <= 0) {
        throw new Error("Insufficient amount!");
      }

      const senderBalanceResults = await query(
        `SELECT balance FROM USER WHERE username = ?`,
        [senderUsername]
      );
      const senderBalance = senderBalanceResults[0].balance;

      if (senderBalance < amount) {
        throw new Error("Insufficient balance!");
      }

      await query(`UPDATE USER SET balance = balance - ? WHERE username = ?`, [
        amount,
        senderUsername,
      ]);
      await query(`UPDATE USER SET balance = balance + ? WHERE username = ?`, [
        amount,
        receiverUsername,
      ]);

      return "Transfer successful!";
    } catch (err) {
      throw err;
    }
  }
}
