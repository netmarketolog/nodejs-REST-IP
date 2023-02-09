const jwt = require("jsonwebtoken");
const { User } = require("../models/user-schema");
const { Unauthorized } = require("http-errors");

function HttpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };
}

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    throw Unauthorized("Token type is not valid");
  }

  if (!token) {
    throw Unauthorized("No token provided");
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    console.log("user", user);

    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw Unauthorized("Jwt token is not valid");
    }
    throw error;
  }
}

module.exports = {
  validateBody,
  auth,
  HttpError,
};
