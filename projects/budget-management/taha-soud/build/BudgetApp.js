"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserFactory_1 = __importDefault(require("./UserFactory"));
class BudgetApp {
    constructor() {
        this.users = [];
        BudgetApp._instance = this;
    }
    static getInstance() {
        if (!BudgetApp._instance) {
            BudgetApp._instance = new BudgetApp();
        }
        return BudgetApp._instance;
    }
    addUser(userName, firstName, lastName, balance) {
        if (this.users.find(user => user.userName === userName)) {
            throw new Error("User already exists");
        }
        const user = UserFactory_1.default.createUser(userName, firstName, lastName, balance);
        this.users.push(user);
        return user;
    }
    deposit(userName, amount) {
        const user = this.users.find(user => user.userName === userName);
        if (!user) {
            throw new Error("User not found");
        }
        if (amount <= 0) {
            throw new Error("Invalid amount");
        }
        user.balance += amount;
    }
    sendMoney(fromUser, toUser, amount) {
        const fromUserName = this.users.find(user => user.userName === fromUser);
        const toUserName = this.users.find(user => user.userName === toUser);
        if (!fromUserName) {
            throw new Error("Sender username doesn't exist");
        }
        if (!toUserName) {
            throw new Error("Receiver username doesn't exist");
        }
        if (amount <= 0) {
            throw new Error("Invalid amount");
        }
        if (fromUserName.balance < amount) {
            throw new Error("Not enough balance to send transfer money");
        }
        fromUserName.balance -= amount;
        toUserName.balance += amount;
    }
    getMostRichUsers(n = 3) {
        return this.users.sort((a, b) => b.balance - a.balance).slice(0, n);
    }
    getUsers() {
        return this.users;
    }
    resetUsers() {
        this.users = [];
    }
}
BudgetApp._instance = null;
exports.default = BudgetApp;
//# sourceMappingURL=BudgetApp.js.map