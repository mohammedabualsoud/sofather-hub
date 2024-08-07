const UserFactory = require("./UserFactory");

class BudgetApp {
  constructor() {
    if (BudgetApp._instance) {
      throw new Error(
        "Use BudgetApp.getInstance() to get an instance of this class."
      );
    }

    this.users = [];
    BudgetApp._instance = this;
  }

  static getInstance() {
    if (!BudgetApp._instance) {
      BudgetApp._instance = new BudgetApp();
    }

    return BudgetApp._instance;
  }

  addUser(userName, firstName, lastName) {
    if (this.users.find((user) => user.userName === userName)) {
      throw new Error("User already exists");
    }

    const user = UserFactory.createUser(userName, firstName, lastName);
    this.users.push(user);

    return user;
  }

  deposit(userName, amount) {
    const user = this.users.find((user) => user.userName === userName);

    if (!user) {
      throw new Error("User doesn't exist");
    }

    user.balance += amount;
  }

  sendMoney(sender, receiver, amount) {
    const fromSender = this.users.find((user) => user.userName === sender);
    const toReceiver = this.users.find((user) => user.userName === receiver);

    if (amount <= 0) {
      throw new Error("The amount you want to transfer must be positive");
    }

    if (!fromSender) {
      throw new Error("Sender username doesn't exist");
    }

    if (!toReceiver) {
      throw new Error("Receiver username doesn't exist");
    }

    if (fromSender.balance < amount) {
      throw new Error("Not enough balance to send money");
    }

    fromSender.balance -= amount;
    toReceiver.balance += amount;
  }
  getMostRichUsers(n = 3) {
    return this.users.sort((a, b) => b.balance - a.balance).slice(0, n);
  }
}

BudgetApp._instance = null; // Initialize the static property

module.exports = BudgetApp;
