import pkg from "pg";
const { Pool } = pkg;
import type { Pool as PoolType } from "pg";
import dotenv from "dotenv";

dotenv.config();

class BudgetApp {
  private static _instance: BudgetApp | null = null;
  private _db: PoolType;

  private constructor(pool: PoolType) {
    this._db = pool;
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
    const existingUser = await this._db.query(
      `SELECT * FROM "user" WHERE "userName" = $1`,
      [userName]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("User already exists");
    }

    await this._db.query(
      `INSERT INTO "user" ("userName", "firstName", "lastName", "balance") VALUES ($1, $2, $3, $4)`,
      [userName, firstName, lastName, balance]
    );
  }

  public async deposit(userName: string, amount: number): Promise<void> {
    const userResult = await this._db.query(
      `SELECT * FROM "user" WHERE "userName" = $1`,
      [userName]
    );

    if (userResult.rows.length === 0) {
      throw new Error("User does not exist");
    }

    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    const user = userResult.rows[0];
    const newBalance = user.balance + amount;

    await this._db.query(
      `UPDATE "user" SET "balance" = $1 WHERE "userName" = $2`,
      [newBalance, userName]
    );
  }

  public async sendMoney(
    senderUserName: string,
    receiverUserName: string,
    amount: number
  ): Promise<void> {
    const senderResult = await this._db.query(
      `SELECT * FROM "user" WHERE "userName" = $1`,
      [senderUserName]
    );

    const receiverResult = await this._db.query(
      `SELECT * FROM "user" WHERE "userName" = $1`,
      [receiverUserName]
    );

    if (senderResult.rows.length === 0) {
      throw new Error("Sender does not exist");
    }

    if (receiverResult.rows.length === 0) {
      throw new Error("Receiver does not exist");
    }

    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    const sender = senderResult.rows[0];
    if (sender.balance < amount) {
      throw new Error("Sender has insufficient funds");
    }

    await this._db.query(
      `UPDATE "user" SET "balance" = "balance" - $1 WHERE "userName" = $2`,
      [amount, senderUserName]
    );

    await this._db.query(
      `UPDATE "user" SET "balance" = "balance" + $1 WHERE "userName" = $2`,
      [amount, receiverUserName]
    );
  }

  public async getMostRichUsers(n = 3): Promise<any[]> {
    const topUsers = await this._db.query(
      `SELECT * FROM "user" ORDER BY "balance" DESC LIMIT $1`,
      [n]
    );
    return topUsers.rows;
  }

  public async getUsers(): Promise<any[]> {
    const users = await this._db.query(`SELECT * FROM "user"`);
    return users.rows;
  }

  public async resetUsers(): Promise<void> {
    await this._db.query(`DELETE FROM "user" WHERE true`);
  }
}

export default BudgetApp;
