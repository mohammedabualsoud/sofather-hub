"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(userName, firstName, lastName, balance) {
        this._userName = userName;
        this._firstName = firstName;
        this._lastName = lastName;
        this._balance = balance;
    }
    get userName() {
        return this._userName;
    }
    set userName(value) {
        this._userName = value;
    }
    get firstName() {
        return this._firstName;
    }
    set firstName(value) {
        this._firstName = value;
    }
    get lastName() {
        return this._lastName;
    }
    set lastName(value) {
        this._lastName = value;
    }
    get balance() {
        return this._balance;
    }
    set balance(value) {
        if (value < 0) {
            throw new Error('Balance cannot be negative');
        }
        this._balance = value;
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map