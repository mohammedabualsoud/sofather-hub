import User from "./User.js";
export default class BudgetManagementService {
  static users = new Map();

  static getUserByUsername(userName) {
    const user = BudgetManagementService.users.get(userName);
    if (user) {
      return {
        username: user.getUsername(),
        firstName: user.getFirstname(),
        lastName: user.getLastname(),
        balance: user.getBalance(),
      };
    } else {
      console.log("This User not found !");
    }
  }

  deposit(username, amount) {
    const user = BudgetManagementService.users.get(username);

    if (!user) {
      console.log("User not found!");
      return;
    }

    if (typeof amount !== "number" || amount <= 0) {
      console.log("Invalid amount. Please enter a positive number.");
      return;
    }

    user.setBalance(user.getBalance() + amount);
    console.log("Deposit successful!");
  }

  transfer(senderUsername, receiverUsername, amount) {
    const sender = BudgetManagementService.users.get(senderUsername);
    if (!sender) {
      console.log("Sender not found!");
      return;
    }

    const receiver = BudgetManagementService.users.get(receiverUsername);
    if (!receiver) {
      console.log("Receiver not found!");
      return;
    }

    if (typeof amount !== "number" || amount <= 0) {
      console.log("Please enter a valid amount.");
      return;
    }

    if (amount > sender.getBalance()) {
      console.log("Insufficient balance for the transfer.");
      return;
    }

    sender.setBalance(sender.getBalance() - amount);
    receiver.setBalance(receiver.getBalance() + amount);
    console.log("Transfer successful!");
  }
}
