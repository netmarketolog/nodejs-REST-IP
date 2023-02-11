const jwt = require("jsonwebtoken");
const { User } = require("../models/user-schema");
const { Unauthorized } = require("http-errors");
const multer = require("multer");
const path = require("path");

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
  next();
}

const storage = multer.diskStorage({
  dest: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../tmp"));
  },
  filename: function (req, file, cb) {
    cb(null, Math.round(Math.random() * 100) + file.originalname);
  },
});

const upload = multer({
  storage,
});

module.exports = {
  validateBody,
  auth,
  HttpError,
  upload,
};
