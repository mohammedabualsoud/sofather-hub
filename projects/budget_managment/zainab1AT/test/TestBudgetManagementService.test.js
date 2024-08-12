import { describe, it, expect, vi } from "vitest";
import BudgetManagementService from "../BudgetManagementService.js";

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


