import pkg from "pg";
import type { Pool as PoolType } from "pg"; // Import the Pool type

const { Pool } = pkg;

class UserDAL {
  private _db: PoolType;

  constructor(pool: PoolType) {
    this._db = pool;
  }

  public async getUserByUserName(userName: string): Promise<any> {
    const result = await this._db.query(
      `SELECT * FROM "user" WHERE "userName" = $1`,
      [userName]
    );
    return result.rows[0];
  }

  public async addUser(
    userName: string,
    firstName: string,
    lastName: string,
    balance: number
  ): Promise<void> {
    await this._db.query(
      `INSERT INTO "user" ("userName", "firstName", "lastName", "balance") VALUES ($1, $2, $3, $4)`,
      [userName, firstName, lastName, balance]
    );
  }

  public async updateUserBalance(
    userName: string,
    newBalance: number
  ): Promise<void> {
    await this._db.query(
      `UPDATE "user" SET "balance" = $1 WHERE "userName" = $2`,
      [newBalance, userName]
    );
  }

  public async getTopUsers(limit: number): Promise<any[]> {
    const result = await this._db.query(
      `SELECT * FROM "user" ORDER BY "balance" DESC LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  public async getAllUsers(): Promise<any[]> {
    const result = await this._db.query(`SELECT * FROM "user"`);
    return result.rows;
  }

  public async deleteAllUsers(): Promise<void> {
    await this._db.query(`DELETE FROM "user" WHERE true`);
  }
}

export default UserDAL;
