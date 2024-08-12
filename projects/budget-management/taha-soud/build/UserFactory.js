"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
class UserFactory {
    static createUser(userName, firstName, lastName, balance) {
        return new User_1.default(userName, firstName, lastName, balance);
    }
}
exports.default = UserFactory;
//# sourceMappingURL=UserFactory.js.map