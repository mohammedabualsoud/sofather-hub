"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const BudgetApp_1 = __importDefault(require("./BudgetApp"));
const app = BudgetApp_1.default.getInstance();
(function testBudgetApp() {
    var _a, _b, _c, _d, _e, _f, _g;
    app.resetUsers();
    console.log('Testing addUser: Adding a new user...');
    const user1 = app.addUser('user1', 'Ali', 'Saad', 0);
    assert_1.default.strictEqual(user1.userName, 'user1');
    assert_1.default.strictEqual(user1.firstName, 'Ali');
    assert_1.default.strictEqual(user1.lastName, 'Saad');
    assert_1.default.strictEqual(user1.balance, 0);
    console.log('addUser passed');
    console.log('Testing addUser: Adding a duplicate user...');
    assert_1.default.throws(() => {
        app.addUser('user1', 'Ali', 'Saad', 0);
    }, { message: 'User already exists' });
    console.log('Duplicate user addition passed');
    console.log('Testing deposit: Depositing a positive amount into a user\'s account...');
    app.deposit('user1', 100);
    assert_1.default.strictEqual((_a = app.getUsers().find(user => user.userName === 'user1')) === null || _a === void 0 ? void 0 : _a.balance, 100);
    console.log('Deposit with positive amount passed');
    console.log('Testing sendMoney: Sending money between users...');
    const user2 = app.addUser('user2', 'Abed', 'Ahmad', 250);
    const initialBalanceUser1 = (_c = (_b = app.getUsers().find(user => user.userName === 'user1')) === null || _b === void 0 ? void 0 : _b.balance) !== null && _c !== void 0 ? _c : 0;
    const initialBalanceUser2 = (_e = (_d = app.getUsers().find(user => user.userName === 'user2')) === null || _d === void 0 ? void 0 : _d.balance) !== null && _e !== void 0 ? _e : 0;
    app.sendMoney('user2', 'user1', 50);
    assert_1.default.strictEqual((_f = app.getUsers().find(user => user.userName === 'user1')) === null || _f === void 0 ? void 0 : _f.balance, initialBalanceUser1 + 50);
    assert_1.default.strictEqual((_g = app.getUsers().find(user => user.userName === 'user2')) === null || _g === void 0 ? void 0 : _g.balance, initialBalanceUser2 - 50);
    console.log('sendMoney passed');
    console.log('Testing sendMoney: Sending money errors...');
    assert_1.default.throws(() => {
        app.sendMoney('user1', 'user10', 20);
    }, { message: 'Receiver username doesn\'t exist' });
    assert_1.default.throws(() => {
        app.sendMoney('user1', 'user2', -10);
    }, { message: 'Invalid amount' });
    console.log('sendMoney errors passed');
    console.log('Testing getMostRichUsers: Retrieving top users by balance...');
    const user3 = app.addUser('user3', 'Ahmad', 'Ali', 300);
    const expectedTopUsers = app.getUsers()
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 3);
    assert_1.default.deepStrictEqual(app.getMostRichUsers(3), expectedTopUsers);
    console.log('getMostRichUsers passed');
    console.log('All tests passed!');
})();
//# sourceMappingURL=TestBudgetApp.js.map