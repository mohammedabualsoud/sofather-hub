import BudgetManagementService from "./BudgetManagementService.js";
export default class User {
  constructor(userName, firstName, lastName) {
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.balance = 0;
  }

  setBalance(newBalance) {
    this.balance = newBalance;
  }

  setBalance(newBalance) {
    this.#balance = newBalance;
  }

  getUsername() {
    return this.userName;
  }

  getFirstname() {
    return this.firstName;
  }

  getLastname() {
    return this.lastName;
  }

  getBalance() {
    return this.balance;
  }
}
