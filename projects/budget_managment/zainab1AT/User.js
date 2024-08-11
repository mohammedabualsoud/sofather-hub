import BudgetManagementService from './BudgetManagementService.js'; 
export default class User {
  #userName;
  #firstName;
  #lastName;
  #balance;

  constructor(userName, firstName, lastName) {
    if (BudgetManagementService.users.has(userName)) {
      console.log("This username already exists");
    } else {
      this.#userName = userName;
      this.#firstName = firstName;
      this.#lastName = lastName;
      this.#balance = 0;
      BudgetManagementService.users.set(userName, this);
      console.log("User added successfully!");
    }
  }

  setBalance(newBalance) {
    this.#balance = newBalance;
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
}
