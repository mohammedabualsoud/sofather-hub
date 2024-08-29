// test/auth.test.js
const assert = require("assert");
const { registerUser, loginUser } = require("../controllers/authController");
const { basicAuth } = require("../middlewares/authMiddleware");
const User = require("../models/user");

// Mock the User model
const mockCreate = (User.create = async function (userDetails) {
  if (!userDetails.email || !userDetails.password || !userDetails.userName) {
    throw new Error("User validation failed");
  }
  return userDetails;
});

const mockFindOne = (User.findOne = async function ({ userName }) {
  if (userName === "testuser") {
    return {
      userName: "testuser",
      password: "password123",
      matchPassword: async function (password) {
        return password === "password123";
      },
      role: "user",
    };
  }
  return null;
});

describe("Auth Controller", function () {
  describe("registerUser", function () {
    it("should register a new user successfully", async function () {
      const req = {
        body: {
          userName: "testuser",
          email: "testuser@example.com",
          password: "password123",
        },
      };
      const res = {
        status: function (code) {
          assert.strictEqual(code, 201);
          return this;
        },
        json: function (data) {
          assert.strictEqual(data.success, true);
          assert.strictEqual(data.data.userName, req.body.userName);
        },
      };

      await registerUser(req, res);
    });

    it("should return an error if user registration fails", async function () {
      const req = {
        body: {
          userName: "testuser",
        },
      };
      const res = {
        status: function (code) {
          assert.strictEqual(code, 400);
          return this;
        },
        json: function (data) {
          assert.strictEqual(data.success, false);
          assert.strictEqual(data.error, "User validation failed");
        },
      };

      await registerUser(req, res);
    });
  });

  describe("loginUser", function () {
    it("should login a user successfully", async function () {
      const req = {
        body: {
          userName: "testuser",
          password: "password123",
        },
      };
      const res = {
        status: function (code) {
          assert.strictEqual(code, 200);
          return this;
        },
        json: function (data) {
          assert.strictEqual(data.success, true);
          assert.strictEqual(data.data.userName, req.body.userName);
        },
      };

      await loginUser(req, res);
    });

    it("should return an error if login credentials are invalid", async function () {
      const req = {
        body: {
          userName: "invaliduser",
          password: "wrongpassword",
        },
      };
      const res = {
        status: function (code) {
          assert.strictEqual(code, 401);
          return this;
        },
        json: function (data) {
          assert.strictEqual(data.success, false);
          assert.strictEqual(data.error, "Invalid Credentials");
        },
      };

      await loginUser(req, res);
    });
  });
});

describe("Basic Authentication Middleware", function () {
  it("should authenticate a user with valid credentials", async function () {
    const req = {
      headers: {
        authorization:
          "Basic " + Buffer.from("testuser:password123").toString("base64"),
      },
    };
    const res = {
      status: function (code) {
        assert.strictEqual(code, 200);
        return this;
      },
      json: function (data) {},
    };
    const next = function () {
      assert.strictEqual(req.user.userName, "testuser");
    };

    await basicAuth(req, res, next);
  });

  it("should deny access with invalid credentials", async function () {
    const req = {
      headers: {
        authorization:
          "Basic " + Buffer.from("testuser:wrongpassword").toString("base64"),
      },
    };
    const res = {
      status: function (code) {
        assert.strictEqual(code, 401);
        return this;
      },
      json: function (data) {
        assert.strictEqual(data.message, "Invalid email or password");
      },
    };
    const next = function () {};

    await basicAuth(req, res, next);
  });
});

describe("Protected Routes", function () {
  it("should allow access to the protected route for authenticated users", async function () {
    const req = {
      headers: {
        authorization:
          "Basic " + Buffer.from("testuser:password123").toString("base64"),
      },
    };
    const res = {
      status: function (code) {
        assert.strictEqual(code, 200);
        return this;
      },
      json: function (data) {
        assert.strictEqual(
          data.message,
          "Welcome testuser, you have accessed a protected route!"
        );
      },
    };
    const next = function () {
      req.user = {
        userName: "testuser",
        role: "user",
      };
    };

    await basicAuth(req, res, next);
  });

  it("should deny access to the admin route for non-admin users", async function () {
    const req = {
      headers: {
        authorization:
          "Basic " + Buffer.from("testuser:password123").toString("base64"),
      },
      user: {
        role: "user",
      },
    };
    const res = {
      status: function (code) {
        assert.strictEqual(code, 403);
        return this;
      },
      json: function (data) {
        assert.strictEqual(data.message, "Access denied. Admins only.");
      },
    };

    const next = function () {};
    req.user = { userName: "testuser", role: "user" };
    await basicAuth(req, res, next);
  });
});
