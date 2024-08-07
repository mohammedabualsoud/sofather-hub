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
  console.log("Testing addUser...");
  const user1 = app.addUser("user1", "Ali", "Saad");
  assert.strictEqual(user1.userName, "user1");
  assert.strictEqual(user1.firstName, "Ali");
  assert.strictEqual(user1.lastName, "Saad");
  assert.strictEqual(user1.balance, 0);
  console.log("addUser passed");

  // Test duplicate user creation
  console.log("Testing duplicate user creation...");
  try {
    app.addUser("user1", "Ali", "Saad");
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
  const user2 = app.addUser("user2", "Abed", "Ahmad");
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
    assert.strictEqual(
      e.message,
      "The amount you want to transfer must be positive"
    );
  }
  console.log("sendMoney errors passed");

  // Test getMostRichUsers
  console.log("Testing getMostRichUsers...");
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
