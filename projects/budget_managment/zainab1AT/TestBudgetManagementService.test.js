import { describe, it, expect, vi } from "vitest";
import BudgetManagementService from "./BudgetManagementService.js";
import User from "./User.js";

describe("getUserByUsername", () => {
  it("should return the user object if the user exists", () => {
    const service = new BudgetManagementService();
    const userName = "zainabat";
    const firstName = "Zainab";
    const lastName = "Atwa";

    service.addUser(userName, firstName, lastName);

    const result = service.getUserByUsername(userName);

    expect(result).toEqual(service.getUserByUsername(userName));
  });

  it("should throw an error if the user does not exist", () => {
    const service = new BudgetManagementService();

    expect(() => service.getUserByUsername("nonexistent")).toThrow("This User not found !");
  });
});

describe("Deposit", () => {
  it("should process the deposit successfully if the user exists", () => {
    const service = new BudgetManagementService();
    const userName = "zainabat";
    const firstName = "Zainab";
    const lastName = "Atwa";

    const user = service.addUser(userName, firstName, lastName);
    const amount = 500000;
    const initValue = 500000;

    user.setBalance(initValue);
    service.deposit(userName, amount);
    const result = user.getBalance();

    expect(result).toEqual(amount + initValue);
  });

  it("should throw an error if the user does not exist", () => {
    const service = new BudgetManagementService();

    expect(() => service.deposit("nonexistent", 100000000)).toThrow("User not found!");
  });

  it("should throw an error if the deposit amount is invalid", () => {
    const service = new BudgetManagementService();
    const userName = "zainabat";
    const firstName = "Zainab";
    const lastName = "Atwa";

    service.addUser(userName, firstName, lastName);

    expect(() => service.deposit(userName, -20)).toThrow("Invalid amount. Please enter a positive number.");
  });
});

describe("Transfer", () => {
  it("should process the transfer successfully if both users exist", () => {
    const service = new BudgetManagementService();

    const sender = service.addUser("zainabat", "zainab", "atwa");
    const receiver = service.addUser("ali", "ali", "atwa");

    const initValue = 50000;
    sender.setBalance(initValue);

    service.transfer("zainabat", "ali", 2000);

    expect(sender.getBalance()).toBe(initValue - 2000);
    expect(receiver.getBalance()).toBe(2000);
  });

  it("should throw an error if the sender does not exist", () => {
    const service = new BudgetManagementService();

    service.addUser("ali", "ali", "atwa");

    expect(() => service.transfer("nonexistent", "ali", 2000)).toThrow("Sender not found!");
  });

  it("should throw an error if the receiver does not exist", () => {
    const service = new BudgetManagementService();

    const sender = service.addUser("zainabat", "zainab", "atwa");

    const initValue = 50000;
    sender.setBalance(initValue);

    expect(() => service.transfer("zainabat", "nonexistent", 2000)).toThrow("Receiver not found!");
  });

 it("should throw an error if the transfer amount is invalid", () => {
    const service = new BudgetManagementService();

    const sender = service.addUser("zainabat", "zainab", "atwa");
    const receiver = service.addUser("ali", "ali", "atwa");

    const initValue = 50000;
    sender.setBalance(initValue);

    expect(() => service.transfer("zainabat", "ali", -100)).toThrow("Please enter a valid amount.");
  });


  it("should throw an error if the transfer amount is greater than the sender's balance", () => {
    const service = new BudgetManagementService();

    const sender = service.addUser("zainabat", "zainab", "atwa");
    const receiver = service.addUser("ali", "ali", "atwa");

    const initValue = 1000;
    sender.setBalance(initValue);

    expect(() => service.transfer("zainabat", "ali", 5000)).toThrow("Insufficient balance for the transfer.");
  });
});

describe("Add new user", () => {
  it("should add a new user successfully", () => {
    const service = new BudgetManagementService();
    const userName = "zainabat";
    const firstName = "Zainab";
    const lastName = "Atwa";

    const result = service.addUser(userName, firstName, lastName);

    expect(service.users.get(userName)).toEqual(result);
    expect(result).toEqual(new User(userName, firstName, lastName));
  });

  it("should throw an error if the username already exists", () => {
    const service = new BudgetManagementService();
    const userName = "zainabat";
    const firstName = "Zainab";
    const lastName = "Atwa";

    service.addUser(userName, firstName, lastName);

    expect(() => service.addUser(userName, firstName, lastName)).toThrow("User already exists");
  });
});
