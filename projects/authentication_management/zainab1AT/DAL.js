export default class DAL {
  constructor(con) {
    this.con = con;
  }
  async findByUsername(username) {
    const [user] = await this.con.query(
      "SELECT * FROM USER WHERE username = ?",
      [username]
    );
    return user;
  }
  

  async allUsers() {
    const users = await this.con.query("SELECT * FROM USER ");
    return users;
  }

  async addUser(username, email, password, role) {
    await this.con.query(
      `INSERT INTO USER(username,email,password,role)
       VALUES(?,?,?,?)
            ON DUPLICATE KEY UPDATE
            email = VALUES(email),
            role = VALUES(role)`,
      [username, email, password, role]
    );
  }
}
