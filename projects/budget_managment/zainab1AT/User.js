export default class User {
  static users = new Map();
  #userName;
  #firstName;
  #lastName;
  #balance;

  constructor(userName, firstName, lastName) {
    if (User.users.has(userName)) {
      console.log("This username already exists");
    } else {
      this.#userName = userName;
      this.#firstName = firstName;
      this.#lastName = lastName;
      this.#balance = 0;
      User.users.set(userName, this);
    }
  }

  getUsername() {
    return this.#userName;
  }

  getFirstname() {
    return this.#firstName;
  }

  getLastname() {
    return this.#lastName;
  }

  getBalance() {
    return this.#balance;
  }

  static getUserByUsername(userName) {
    const user = User.users.get(userName);
    if (user) {
      return JSON.stringify({
        username: User.users.get(userName).getUsername(),
        firstName: User.users.get(userName).getFirstname(),
        lastName: User.users.get(userName).getLastname(),
        balance: User.users.get(userName).getBalance(),
      });
    } else {
      console.log("This User doesn't exist");
    }
  }

  setBalance(newBalance) {
    this.#balance = newBalance;
  }

  deposit(amount) {
    if (typeof amount === "number" && amount > 0) {
      this.#balance += amount;
    } else {
      console.log("Invalid Deposition, enter valid value !");
    }
  }

  transfer(receiverUsername, amount) {
    if (typeof receiverUsername === "string" && typeof amount === "number") {
      if (amount < 0)
        console.log("Invalid Transferation, enter valid amount !");
      else if (amount <= this.#balance) {
        this.#balance -= amount;
        User.users
          .get(receiverUsername)
          .setBalance(User.users.get(receiverUsername).getBalance() + amount);
      } else {
        console.log("Invalid Transferation, you don't have enough money !");
      }
    } else {
      console.log(
        "Invalid Transferation, enter valid values for username and amount !"
      );
    }
  }
}
