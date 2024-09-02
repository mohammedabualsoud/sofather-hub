const assert = require("assert");
const { registerUser, loginUser } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/jwtMiddleware");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const mockCreate = (User.create = async function (userDetails) {
  if (!userDetails.email || !userDetails.password || !userDetails.userName) {
    const error = new Error("User validation failed");
    error.name = "ValidationError";
    throw error;
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

const mockJwtSign = (jwt.sign = function (payload, secret, options) {
  return "mocked-jwt-token";
});

const mockJwtVerify = (jwt.verify = function (token, secret, callback) {
  if (token === "mocked-jwt-token") {
    return { id: "user_id", userName: "testuser", role: "user" };
  } else {
    throw new Error("Invalid token");
  }
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
          assert.strictEqual(data.data.user.userName, req.body.userName);
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
    it("should login a user successfully and return a JWT token", async function () {
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
          assert.strictEqual(data.data.token, "mocked-jwt-token");
          assert.strictEqual(data.data.user.userName, req.body.userName);
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

describe("JWT Authentication Middleware", function () {
  it("should authenticate a user with a valid token", async function () {
    const req = {
      header: function (name) {
        if (name === "Authorization") {
          return "Bearer mocked-jwt-token";
        }
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
      req.user = { userName: "testuser", role: "user" };
      assert.strictEqual(req.user.userName, "testuser");
    };

    await verifyToken(req, res, next);
  });

  it("should deny access with an invalid token", async function () {
    const req = {
      header: function (name) {
        if (name === "Authorization") {
          return "Bearer invalid-jwt-token";
        }
      },
    };
    const res = {
      status: function (code) {
        assert.strictEqual(code, 401);
        return this;
      },
      json: function (data) {
        assert.strictEqual(data.message, "Invalid token.");
      },
    };
    const next = function () {};

    await verifyToken(req, res, next);
  });

  it("should deny access if no token is provided", async function () {
    const req = {
      header: function (name) {
        return null;
      },
    };
    const res = {
      status: function (code) {
        assert.strictEqual(code, 401);
        return this;
      },
      json: function (data) {
        assert.strictEqual(data.message, "Access denied. No token provided.");
      },
    };
    const next = function () {};

    await verifyToken(req, res, next);
  });
});

describe("Protected Routes", function () {
  it("should allow access to the protected route for authenticated users", async function () {
    const req = {
      header: function (name) {
        if (name === "Authorization") {
          return "Bearer mocked-jwt-token";
        }
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
      req.user = { userName: "testuser", role: "user" };
    };

    await verifyToken(req, res, next);
  });

  it("should deny access to the admin route for non-admin users", async function () {
    const req = {
      header: function (name) {
        if (name === "Authorization") {
          return "Bearer mocked-jwt-token";
        }
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

    const next = function () {
      req.user = { userName: "testuser", role: "user" };
    };
    await verifyToken(req, res, next);
  });
});
