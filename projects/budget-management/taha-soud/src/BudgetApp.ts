import UserFactory from "./UserFactory";
import User from "./User";

class BudgetApp {
  private static _instance: BudgetApp | null = null;
  private users: User[];

  private constructor() {
    this.users = [];
    BudgetApp._instance = this;
  }

  public static getInstance(): BudgetApp {
    if (!BudgetApp._instance) {
      BudgetApp._instance = new BudgetApp();
    }
    return BudgetApp._instance;
  }

  public addUser(userName: string, firstName: string, lastName: string, balance: number): User {
    if (this.users.find(user => user.userName === userName)) {
      throw new Error("User already exists");
    }
    const user = UserFactory.createUser(userName, firstName, lastName, balance);
    this.users.push(user);
    return user;
  }

  public deposit(userName: string, amount: number): void {
    const user = this.users.find(user => user.userName === userName);
    if (!user) {
      throw new Error("User not found");
    }
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }
    user.balance += amount;  // Using the setter in User class
  }

  public sendMoney(fromUser: string, toUser: string, amount: number): void {
    const from = this.users.find(user => user.userName === fromUser);
    const to = this.users.find(user => user.userName === toUser);

    if (!from) {
      throw new Error("Sender username doesn't exist");
    }
    if (!to) {
      throw new Error("Receiver username doesn't exist");
    }
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }
    if (from.balance < amount) {
      throw new Error("Not enough balance to send transfer money");
    }

    from.balance -= amount;  // Using the setter in User class
    to.balance += amount;    // Using the setter in User class
  }

  public getMostRichUsers(n = 3): User[] {
    return this.users
      .sort((a, b) => b.balance - a.balance)
      .slice(0, n);
  }

  public getUsers(): User[] {
    return this.users;
  }

  public resetUsers(): void {
    this.users = [];
  }
}

export default BudgetApp;
