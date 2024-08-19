import assert from "assert";
import BudgetApp from "./BudgetApp.js";

const app = await BudgetApp.getInstance();

async function testBudgetApp() {
  await app.resetUsers();
  assert.strictEqual((await app.getUsers()).length, 0, "Reset failed");

  console.log("Testing addUser: Adding user1...");
  const user1 = await app.addUser("user1", "Ali", "Saad", 0);
  assert(user1, "User1 was not added!");
  assert.strictEqual(user1.userName, "user1");
  assert.strictEqual(user1.firstName, "Ali");
  assert.strictEqual(user1.lastName, "Saad");
  assert.strictEqual(user1.balance, 0);
  console.log("addUser passed");

  console.log("Testing addUser: Adding user2...");
  const user2 = await app.addUser("user2", "Abed", "Ahmad", 250);
  assert(user2, "User2 was not added!");
  console.log("User2 added");

  console.log("Testing deposit: Depositing to user1...");
  await app.deposit("user1", 100);
  const updatedUser1 = (await app.getUsers()).find(
    (user) => user.userName === "user1"
  );
  assert.strictEqual(updatedUser1?.balance, 100, "Deposit failed!");
  console.log("Deposit passed");

  console.log("Testing sendMoney: Sending money from user2 to user1...");
  await app.sendMoney("user2", "user1", 50);
  const updatedUser1AfterTransfer = (await app.getUsers()).find(
    (user) => user.userName === "user1"
  );
  const updatedUser2AfterTransfer = (await app.getUsers()).find(
    (user) => user.userName === "user2"
  );
  assert.strictEqual(
    updatedUser1AfterTransfer?.balance,
    150,
    "Transfer failed for user1!"
  );
  assert.strictEqual(
    updatedUser2AfterTransfer?.balance,
    200,
    "Transfer failed for user2!"
  );
  console.log("sendMoney passed");

  console.log("Testing getMostRichUsers: Retrieving top users by balance...");
  const user3 = await app.addUser("user3", "Ahmad", "Ali", 300);
  const expectedTopUsers = (await app.getUsers())
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 3);
  const mostRichUsers = await app.getMostRichUsers(3);
  assert.deepStrictEqual(mostRichUsers, expectedTopUsers);
  console.log("getMostRichUsers passed");

  console.log("All tests passed!");
}

testBudgetApp().catch((error) => {
  console.error("Test failed:", error);
});
