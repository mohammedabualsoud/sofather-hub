export default class User {
  #userName;
  #firstName;
  #lastName;
  #balance;

   constructor(userName, firstName, lastName) {
    this.#userName = userName;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#balance = 0;
  }

  setBalance(newBalance) {
    this.balance = newBalance;
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
