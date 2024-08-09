const User = require("./User");

class UserFactory {
  static createUser(userName, firstName, lastName) {
    return new User(userName, firstName, lastName);
  }
}

module.exports = UserFactory;
