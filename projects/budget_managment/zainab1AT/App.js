import BudgetManagementService from "./BudgetManagementService.js";
import readlineSync from "readline-sync";

async function main() {
  try {
    console.log("\t\t\t Welcome to Budget Management !");
    let stop = false;
    const BudgetManagement = new BudgetManagementService();
    while (!stop) {
      console.clear();
      console.log("\t\t\t Welcome to Budget Management !");
      console.log(
        "-----------------------------------------------------------------------------"
      );
      console.log("1. Add User");
      console.log("2. Deposit Money");
      console.log("3. Transfer Money");
      console.log("4. View User Information");
      console.log("5. Exit");
      console.log(
        "-----------------------------------------------------------------------------"
      );

      const choice = readlineSync.question("Please choose an option (1-5): ");

      switch (choice) {
        case "1":
          console.clear();
          console.log("--- Add User ---");
          const username = readlineSync.question("Enter Username: ");
          const fname = readlineSync.question("Enter First Name: ");
          const lname = readlineSync.question("Enter Last Name: ");

          try {
            const res = await BudgetManagement.addUser(username, fname, lname);
            console.log(res);
          } catch (error) {
            console.log(`Error: ${error.message}`);
          }
          readlineSync.question("Press Enter to continue...");
          break;

        case "2":
          console.clear();
          console.log("--- Deposit Money ---");
          const depositUsername = readlineSync.question("Enter Username: ");
          const depositAmount = parseFloat(
            readlineSync.question("Enter Amount: ")
          );
          try {
            await BudgetManagement.deposit(depositUsername, depositAmount);
            console.log(
              `Deposit successful! ${depositAmount} has been added to ${depositUsername}'s account.`
            );
          } catch (error) {
            console.log(`Error: ${error.message}`);
          }
          readlineSync.question("Press Enter to continue...");
          break;

        case "3":
          console.clear();
          console.log("--- Transfer Money ---");
          const senderUsername = readlineSync.question(
            "Enter Sender's Username: "
          );
          const receiverUsername = readlineSync.question(
            "Enter Receiver's Username: "
          );
          const transferAmount = parseFloat(
            readlineSync.question("Enter Amount: ")
          );

          try {
            await BudgetManagement.transfer(
              senderUsername,
              receiverUsername,
              transferAmount
            );
            console.log(
              `Transfer successful! ${transferAmount} has been transferred from ${senderUsername} to ${receiverUsername}.`
            );
          } catch (error) {
            console.log(`Error: ${error.message}`);
          }
          readlineSync.question("Press Enter to continue...");
          break;

        case "4":
          console.clear();
          console.log("--- View User Information ---");
          const viewUsername = readlineSync.question("Enter Username: ");
          const user = await BudgetManagement.getUserByUsername(viewUsername);
          try {
            console.log(user);
          } catch (error) {
            console.log(`Error: ${error.message}`);
          }
          readlineSync.question("Press Enter to continue...");
          break;

        case "5":
          console.clear();
          console.log("Thank you for using Budget Management! Goodbye!");
          stop = true;

          break;

        default:
          console.clear();
          console.log("Invalid choice. Please choose a valid option.");
          readlineSync.question("Press Enter to continue...");
          break;
      }
    }
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
  }
}

main();

