class User {
  constructor(userName, firstName, lastName, balance = 0) {
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.balance = balance;
  }
}

module.exports = User;
