import User from "./User.js";
export default class BudgetManagementService {
   users = new Map();

   getUserByUsername(userName) {
    const user = this.users.get(userName);
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

   addUser(userName, firstName, lastName) {
    const user = new User(userName, firstName, lastName);
    if (this.users.get(userName)){ console.log("User already exists"); return;}
    
    this.users.set(userName, user);
    console.log("User added successfuly !");
    return user;
    
  }

  deposit(username, amount) {
    const user = this.users.get(username);

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
    const sender = this.users.get(senderUsername);
    if (!sender) {
      console.log("Sender not found!");
      return;
    }

    const receiver = this.users.get(receiverUsername);
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
