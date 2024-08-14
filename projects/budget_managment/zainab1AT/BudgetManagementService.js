import User from "./User.js";
export default class BudgetManagementService {
  constructor() {
    this.users = new Map();
  }
  getUserByUsername(userName) {
    const user = this.users.get(userName);
    if (user) return user;
    else throw new Error("This User not found !");
  }

  addUser(userName, firstName, lastName) {
    const user = new User(userName, firstName, lastName);
    if (this.users.get(userName)) throw new Error("User already exists");

    this.users.set(userName, user);
    return user;
  }

  deposit(username, amount) {
    const user = this.users.get(username);

    if (!user) 
      throw new Error("User not found!");

    if (typeof amount !== "number" || amount <= 0) 
      throw new Error("Invalid amount. Please enter a positive number.");

    user.setBalance(user.getBalance() + amount);
  }

  transfer(senderUsername, receiverUsername, amount) {
    const sender = this.users.get(senderUsername);
    if (!sender) 
      throw new Error("Sender not found!");

    const receiver = this.users.get(receiverUsername);
    if (!receiver) 
      throw new Error("Receiver not found!");

    if (typeof amount !== "number") 
      throw new Error("Please enter a valid amount.");

    if (amount < 0) 
      throw new Error("Please enter a valid amount.");

    if (amount > sender.getBalance()) 
     throw new Error("Insufficient balance for the transfer.");

    sender.setBalance(sender.getBalance() - amount);
    receiver.setBalance(receiver.getBalance() + amount);
  }
}
