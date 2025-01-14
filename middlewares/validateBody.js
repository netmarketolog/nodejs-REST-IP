const jwt = require("jsonwebtoken");
const { User } = require("../models/user-schema");
const { Unauthorized, BadRequest } = require("http-errors");
const multer = require("multer");
const path = require("path");

const nodemailer = require("nodemailer");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(BadRequest(error.message));
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

async function sendMail({ to, html, subject }) {
  const email = {
    from: "info@mycontacts.com",
    to,
    subject,
    html,
  };

  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transport.sendMail(email);
}

module.exports = {
  validateBody,
  auth,
  upload,
  sendMail,
};
