import { describe, it, expect, vi } from "vitest";
import BudgetManagementService from "../BudgetManagementService.js";
import User from "../User.js";

describe("getUserByUsername", () => {
  it("should return the user object if the user exists", () => {
    const service = new BudgetManagementService();
    const userName = "zainabat";
    const firstName = "Zainab";
    const lastName = "Atwa";

    service.addUser(userName, firstName, lastName);

    const result = service.getUserByUsername(userName);

    expect(result).toEqual({
      username: userName,
      firstName: firstName,
      lastName: lastName,
      balance: 0,
    });
  });

  it("should return message if the user not exist", () => {
    const service = new BudgetManagementService();

    const userName = "zainabat";

    console.log = vi.fn();

    const result = service.getUserByUsername(userName);

    expect(result).toBeUndefined();
    expect(console.log).toHaveBeenCalledWith("This User not found !");
  });
});

describe("Deposit", () => {
  it("The user exists, and the deposit has been processed successfully.", () => {
    const service = new BudgetManagementService();
    const userName = "zainabat";
    const firstName = "Zainab";
    const lastName = "Atwa";

    const user = service.addUser(userName, firstName, lastName);
    const amount = 500000;
    const initValue = 500000;
    console.log = vi.fn();

    user.setBalance(initValue);
    service.deposit(userName, amount);
    const result = user.getBalance();

    expect(console.log).toHaveBeenCalledWith("Deposit successful!");
    expect(result).toEqual(amount + initValue);
  });

  it("if the user not exist, it must return User not found! as a message ", () => {
    const service = new BudgetManagementService();

    console.log = vi.fn();

    service.deposit("zainab", 100000000);

    expect(console.log).toHaveBeenCalledWith("User not found!");
  });

  it("it should return Invalid amount if the user enter invalid value for the amount (here negative value, but it's the same thing if the value is not number),", () => {
    const service = new BudgetManagementService();
    const userName = "zainabat";
    const firstName = "Zainab";
    const lastName = "Atwa";

    service.addUser(userName, firstName, lastName);

    console.log = vi.fn();

    service.deposit(userName, -20);

    expect(console.log).toHaveBeenCalledWith(
      "Invalid amount. Please enter a positive number."
    );
  });
});

describe("Transfer", () => {
  it("The users exists, and the transfer has been processed successfully.", () => {
    const service = new BudgetManagementService();

    const sender = service.addUser("zainabat", "zainab", "atwa");
    const receiver = service.addUser("ali", "ali", "atwa");

    const initValue = 50000;
    sender.setBalance(initValue);

    console.log = vi.fn();

    service.transfer("zainabat", "ali", 2000);
    expect(console.log).toHaveBeenCalledWith("Transfer successful!");
    expect(sender.getBalance()).toBe(initValue - 2000);
    expect(receiver.getBalance()).toBe(2000);
  });

  it("If the sender not exist ", () => {
    const service = new BudgetManagementService();

    const receiver = service.addUser("ali", "ali", "atwa");

    console.log = vi.fn();

    service.transfer("zainabat", "ali", 2000);
    expect(console.log).toHaveBeenCalledWith("Sender not found!");
  });

  it("If the reciever not exist ", () => {
    const service = new BudgetManagementService();

    const sender = service.addUser("zainabat", "zainab", "atwa");

    const initValue = 50000;
    sender.setBalance(initValue);

    console.log = vi.fn();

    service.transfer("zainabat", "ali", 2000);
    expect(console.log).toHaveBeenCalledWith("Receiver not found!");
  });

  it("If the amount invalid ", () => {
    const service = new BudgetManagementService();

    const sender = service.addUser("zainabat", "zainab", "atwa");

    const initValue = 50000;
    sender.setBalance(initValue);

    console.log = vi.fn();

    service.transfer("zainabat", "ali", 2000);
    expect(console.log).toHaveBeenCalledWith("Receiver not found!");
  });

  it("If the amount less than the balance ", () => {
    const service = new BudgetManagementService();

    const sender = service.addUser("zainabat", "zainab", "atwa");
    const receiver = service.addUser("ali", "ali", "atwa");

    const initValue = 1000;
    sender.setBalance(initValue);

    console.log = vi.fn();

    service.transfer("zainabat", "ali", 2000);
    expect(console.log).toHaveBeenCalledWith(
      "Insufficient balance for the transfer."
    );
  });
});

describe("Add new user", () => {
  it("should add a new user successfully", () => {
    const service = new BudgetManagementService();
    const userName = "zainabat";
    const firstName = "Zainab";
    const lastName = "Atwa";

    console.log = vi.fn();

    const result = service.addUser(userName, firstName, lastName);

    expect(service.users.get(userName)).toEqual(result);
    expect(result).toEqual(new User(userName, firstName, lastName));
    expect(console.log).toHaveBeenCalledWith("User added successfully!");
  });

  it("should not add a user if the username already exists", () => {
    const service = new BudgetManagementService();
    const userName = "zainabat";
    const firstName = "Zainab";
    const lastName = "Atwa";
    service.addUser(userName, firstName, lastName);
    console.log = vi.fn();
    const result = service.addUser(userName, firstName, lastName);
    expect(service.users.size).toBe(1);
    expect(console.log).toHaveBeenCalledWith("User already exists");
    expect(result).toBeUndefined();
  });
});
