import pkg from "pg";
import type { Pool as PoolType } from "pg"; // Import Pool type separately
import dotenv from "dotenv";
import UserDAL from "../models/UserDAL.js";

dotenv.config();

const { Pool } = pkg; // Destructure Pool from the pg module

class BudgetApp {
  private static _instance: BudgetApp | null = null;
  private _userDAL: UserDAL;

  private constructor(pool: PoolType) {
    // Use the PoolType here
    this._userDAL = new UserDAL(pool);
  }

  public static async getInstance(): Promise<BudgetApp> {
    if (!BudgetApp._instance) {
      const pool = new Pool({
        user: process.env.DB_USERNAME,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || "5432", 10),
      });

      BudgetApp._instance = new BudgetApp(pool);
    }

    return BudgetApp._instance;
  }

  public async addUser(
    userName: string,
    firstName: string,
    lastName: string,
    balance: number
  ): Promise<void> {
    const existingUser = await this._userDAL.getUserByUserName(userName);

    if (existingUser) {
      throw new Error(`User ${userName} already exists`);
    }

    await this._userDAL.addUser(userName, firstName, lastName, balance);
  }

  public async deposit(userName: string, amount: number): Promise<void> {
    const user = await this._userDAL.getUserByUserName(userName);

    if (!user) {
      throw new Error(`User ${userName} does not exist`);
    }

    if (amount <= 0) {
      throw new Error("Invalid deposit amount");
    }

    const newBalance = user.balance + amount;
    await this._userDAL.updateUserBalance(userName, newBalance);
  }

  public async sendMoney(
    senderUserName: string,
    receiverUserName: string,
    amount: number
  ): Promise<void> {
    const sender = await this._userDAL.getUserByUserName(senderUserName);
    const receiver = await this._userDAL.getUserByUserName(receiverUserName);

    if (!sender) {
      throw new Error(`Sender "${senderUserName}" does not exist`);
    }

    if (!receiver) {
      throw new Error(`Receiver "${receiverUserName}" does not exist`);
    }

    if (amount <= 0) {
      throw new Error("Invalid amount. Amount must be greater than zero.");
    }

    if (sender.balance < amount) {
      throw new Error(`Sender "${senderUserName}" has insufficient funds`);
    }

    await this._userDAL.updateUserBalance(
      senderUserName,
      sender.balance - amount
    );
    await this._userDAL.updateUserBalance(
      receiverUserName,
      receiver.balance + amount
    );
  }

  public async getMostRichUsers(n = 3): Promise<any[]> {
    return await this._userDAL.getTopUsers(n);
  }

  public async getUsers(): Promise<any[]> {
    return await this._userDAL.getAllUsers();
  }

  public async resetUsers(): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      await this._userDAL.deleteAllUsers();
    } else {
      throw new Error("Cannot reset users in production");
    }
  }
}

export default BudgetApp;
