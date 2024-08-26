const assert = require("assert");
const BudgetApp = require("./BudgetApp");

// Get the singleton instance
const app = BudgetApp.getInstance();

function resetUsers() {
  app.users = [];
}

(function testBudgetApp() {
  resetUsers();

  // Test addUser
  console.log("Testing addUser: Adding a new user...");
  const user1 = app.addUser("user1", "Ali", "Saad");
  assert.strictEqual(user1.userName, "user1");
  assert.strictEqual(user1.firstName, "Ali");
  assert.strictEqual(user1.lastName, "Saad");
  assert.strictEqual(user1.balance, 0);
  console.log("addUser passed");

  // Test duplicate user
  console.log("Testing addUser: Adding a duplicate user...");
  assert.throws(() => {
    app.addUser("user1", "Ali", "Saad");
  }, new Error("User already exists"));
  console.log("Duplicate user addition passed");

  // Test deposit
  console.log(
    "Testing deposit: Depositing a positive amount into a user's account..."
  );
  app.deposit("user1", 100);
  assert.strictEqual(
    app.users.find((user) => user.userName === "user1").balance,
    100
  );
  console.log("Deposit with positive amount passed");
  // Test sendMoney
  console.log("Testing sendMoney: Sending money between users...");
  const user2 = app.addUser("user2", "Abed", "Ahmad");
  app.deposit("user2", 200);

  const initialBalanceUser1 = app.users.find(
    (user) => user.userName === "user1"
  ).balance;
  const initialBalanceUser2 = app.users.find(
    (user) => user.userName === "user2"
  ).balance;

  app.sendMoney("user2", "user1", 0);

  const updatedBalanceUser1 = app.users.find(
    (user) => user.userName === "user1"
  ).balance;
  const updatedBalanceUser2 = app.users.find(
    (user) => user.userName === "user2"
  ).balance;

  assert.strictEqual(updatedBalanceUser1, initialBalanceUser1 + 50);
  assert.strictEqual(updatedBalanceUser2, initialBalanceUser2 - 50);
  console.log("sendMoney passed");

  // Test sendMoney errors
  console.log("Testing sendMoney: Sending money errors...");

  assert.throws(() => {
    app.sendMoney("user1", "user10", 20);
  }, new Error("Receiver username doesn't exist"));

  assert.throws(() => {
    app.sendMoney("user1", "user2", -10);
  }, new Error("The amount you want to transfer must be positive"));

  console.log("sendMoney errors passed");

  // Test getMostRichUsers
  console.log("Testing getMostRichUsers: Retrieving top users by balance...");
  const user3 = app.addUser("user3", "Ahmad", "Ali");
  app.deposit("user3", 300);
  assert.deepStrictEqual(app.getMostRichUsers(), [
    app.users.find((user) => user.userName === "user3"),
    app.users.find((user) => user.userName === "user1"),
    app.users.find((user) => user.userName === "user2"),
  ]);
  console.log("getMostRichUsers passed");

  console.log("All tests passed!");
})();
