import assert from "assert";
import BudgetApp from "./BudgetApp";

// Get the singleton instance
const app = BudgetApp.getInstance();

(function testBudgetApp() {
  // Reset users
  app.resetUsers();

  // Test addUser
  console.log("Testing addUser: Adding a new user...");
  const user1 = app.addUser("user1", "Ali", "Saad", 0);
  assert.strictEqual(user1.userName, "user1");
  assert.strictEqual(user1.firstName, "Ali");
  assert.strictEqual(user1.lastName, "Saad");
  assert.strictEqual(user1.balance, 0);
  console.log("addUser passed");

  // Test adding a duplicate user
  console.log("Testing addUser: Adding a duplicate user...");
  assert.throws(
    () => {
      app.addUser("user1", "Ali", "Saad", 0);
    },
    { message: "User already exists" }
  );
  console.log("Duplicate user addition passed");

  // Test deposit
  console.log(
    "Testing deposit: Depositing a positive amount into a user's account..."
  );
  app.deposit("user1", 100);
  assert.strictEqual(
    app.getUsers().find((user) => user.userName === "user1")?.balance,
    100
  );
  console.log("Deposit with positive amount passed");

  // Test sendMoney
  console.log("Testing sendMoney: Sending money between users...");
  const user2 = app.addUser("user2", "Abed", "Ahmad", 250);

  const initialBalanceUser1 =
    app.getUsers().find((user) => user.userName === "user1")?.balance ?? 0;
  const initialBalanceUser2 =
    app.getUsers().find((user) => user.userName === "user2")?.balance ?? 0;

  app.sendMoney("user2", "user1", 50);

  assert.strictEqual(
    app.getUsers().find((user) => user.userName === "user1")?.balance,
    initialBalanceUser1 + 50
  );
  assert.strictEqual(
    app.getUsers().find((user) => user.userName === "user2")?.balance,
    initialBalanceUser2 - 50
  );
  console.log("sendMoney passed");

  // Test sendMoney errors
  console.log("Testing sendMoney: Sending money errors...");

  assert.throws(
    () => {
      app.sendMoney("user1", "user10", 20);
    },
    { message: "Receiver username doesn't exist" }
  );

  assert.throws(
    () => {
      app.sendMoney("user1", "user2", -10);
    },
    { message: "Invalid amount" }
  );

  console.log("sendMoney errors passed");

  console.log("Testing getMostRichUsers: Retrieving top users by balance...");
  const user3 = app.addUser("user3", "Ahmad", "Ali", 300);

  // Retrieve top users and sort them
  const expectedTopUsers = app
    .getUsers()
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 3);

  assert.deepStrictEqual(app.getMostRichUsers(3), expectedTopUsers);
  console.log("getMostRichUsers passed");

  console.log("All tests passed!");
})();
