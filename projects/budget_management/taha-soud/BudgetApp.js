const assert = require("assert");

class User {
  constructor(userName, firstName, lastName, balance = 0) {
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.balance = balance;
  }
}

class UserFactory {
  static createUser(userName, firstName, lastName) {
    return new User(userName, firstName, lastName);
  }
}

class BudgetApp {
  constructor() {
    if (BudgetApp.instance) {
      return BudgetApp.instance;
    }

    this.users = [];
    BudgetApp.instance = this;
  }

  static getInstance() {
    if (!BudgetApp.instance) {
      BudgetApp.instance = new BudgetApp();
    }

    return BudgetApp.instance;
  }

  createUser(userName, firstName, lastName) {
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

    if (!fromSender) {
      throw new Error("Sender username doesn't exist");
    }
    if (!toReceiver) {
      throw new Error("Receiver username doesn't exist");
    }
    if (fromSender.balance < amount) {
      throw new Error("Not enough balance to send money");
    }
    if (amount <= 0) {
      throw new Error("amount must be positive");
    }

    fromSender.balance -= amount;
    toReceiver.balance += amount;
  }

  topUsers(n = 3) {
    return this.users.sort((a, b) => b.balance - a.balance).slice(0, n);
  }
}

(function testBudgetApp() {
  // Get the singleton instance
  const app = BudgetApp.getInstance();

  // Reset users before each test to ensure isolation
  app.users = [];

  // Test createUser
  console.log("Testing createUser...");
  const user1 = app.createUser("user1", "Ali", "Saad");
  assert.strictEqual(user1.userName, "user1");
  assert.strictEqual(user1.firstName, "Ali");
  assert.strictEqual(user1.lastName, "Saad");
  assert.strictEqual(user1.balance, 0);
  console.log("createUser passed");

  // Test duplicate user
  console.log("Testing duplicate user creation...");
  try {
    app.createUser("user1", "Ali", "Saad");
    assert.fail("Expected error not thrown");
  } catch (e) {
    console.log(e.message); // Log the error message
    assert.strictEqual(e.message, "User already exists");
  }
  console.log("Duplicate user creation passed");

  // Test deposit
  console.log("Testing deposit...");
  app.deposit("user1", 100);
  assert.strictEqual(
    app.users.find((user) => user.userName === "user1").balance,
    100
  );
  console.log("Deposit passed");

  // Test sendMoney
  console.log("Testing sendMoney...");
  const user2 = app.createUser("user2", "Abed", "Ahmad");
  app.deposit("user2", 200);
  app.sendMoney("user2", "user1", 50);
  assert.strictEqual(
    app.users.find((user) => user.userName === "user1").balance,
    150
  );
  assert.strictEqual(
    app.users.find((user) => user.userName === "user2").balance,
    150
  );
  console.log("sendMoney passed");

  // Test sendMoney errors
  console.log("Testing sendMoney errors...");
  try {
    app.sendMoney("user2", "user3", 10);
    assert.fail("Expected error not thrown");
  } catch (e) {
    console.log(e.message); // Log the error message
    assert.strictEqual(e.message, "Receiver username doesn't exist");
  }

  try {
    app.sendMoney("user1", "user2", 200);
    assert.fail("Expected error not thrown");
  } catch (e) {
    console.log(e.message); // Log the error message
    assert.strictEqual(e.message, "Not enough balance to send money");
  }

  try {
    app.sendMoney("user1", "user2", -10);
    assert.fail("Expected error not thrown");
  } catch (e) {
    console.log(e.message); // Log the error message
    assert.strictEqual(e.message, "amount must be positive");
  }
  console.log("sendMoney errors passed");

  // Test topUsers
  console.log("Testing topUsers...");
  const user3 = app.createUser("user3", "Ahmad", "Ali");
  app.deposit("user3", 300);
  assert.deepStrictEqual(app.topUsers(), [
    app.users.find((user) => user.userName === "user3"),
    app.users.find((user) => user.userName === "user1"),
    app.users.find((user) => user.userName === "user2"),
  ]);
  console.log("topUsers passed");

  console.log("All tests passed!");
})();
