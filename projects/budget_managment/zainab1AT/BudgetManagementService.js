import { getConnection } from "./mysql.js";
import DAL from "./DAL.js";

export default class BudgetManagementService {
  con = getConnection();
  DALInstanse = new DAL(con);

  async getUserByUsername(userName) {
      const user = await this.DALInstanse.getUserByUsernameQuery(userName);
      return user;
  }

  async addUser(userName, firstName, lastName) {
      await this.DALInstanse.upsertQuery(userName, firstName, lastName);
      const user = await this.DALInstanse.getUserByUsernameQuery(userName);
      return user;
  }

  async deposit(username, amount) {
      const user = await this.DALInstanse.getUserByUsernameQuery(username);

      if (!user) {
        throw new Error("User not found!");
      }
      if (amount <= 0) {
        throw new Error("Insufficient amount!");
      }
      await this.DALInstanse.updateBalanceIncrease(amount, username); 
  }

  async transfer(senderUsername, receiverUsername, amount) {
      const sender = await this.DALInstanse.getUserByUsernameQuery(senderUsername);
      if (!sender) {
        throw new Error("Sender not found!");
      }

      const receiver = await this.DALInstanse.getUserByUsernameQuery(receiverUsername);
      if (!receiver) {
        throw new Error("Receiver not found!");
      }

      if (amount <= 0) {
        throw new Error("Insufficient amount!");
      }

      const senderBalance = await this.DALInstanse.getBalanceByUsernameQuery(
        senderUsername
      );

      if (senderBalance < amount) {
        throw new Error("Insufficient balance!");
      }

      await this.DALInstanse.updateBalanceDecrease(amount, senderUsername);

      await this.DALInstanse.updateBalanceIncrease(amount, receiverUsername);
  }
}
