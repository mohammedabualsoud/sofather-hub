export default class DAL {
  constructor(con) {
    this.con = con;
  }

  async getUserByUsernameQuery(username) {
    const [user] = await this.con.query(
      `SELECT * FROM USER WHERE username = ?`,
      [username]
    );
    return user;
  }

  async getBalanceByUsernameQuery(username) {
    const [balance] = await this.con.query(
      `SELECT balance FROM USER WHERE username = ?`,
      [username]
    );
    return balance;
  }

  async updateBalanceIncrease(amount, username) {
    await this.con.query(
      `UPDATE USER SET balance = balance + ? WHERE username = ?`,
      [amount, username]
    );
  }

  async updateBalanceDecrease(amount, username) {
    await this.con.query(
      `UPDATE USER SET balance = balance - ? WHERE username = ?`,
      [amount, username]
    );
  }

  async upsertQuery(userName, firstName, lastName) {
    await this.con.query(
      `INSERT INTO USER (username, firstName, lastName)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
            firstName = VALUES(firstName),
            lastName = VALUES(lastName)`,
      [userName, firstName, lastName]
    );
  }
}