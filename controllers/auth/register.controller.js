const { User } = require("../../models/user-schema");
const { Conflict } = require("http-errors");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");

async function register(req, res, next) {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatarURL = gravatar.url(email);

  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
    });
    res.status(201).json(savedUser);
  } catch (error) {
    console.log("error while saving user", error.name, error.message);
    if (error.message.includes("E11000 duplicate key error")) {
      throw Conflict("Email in use!");
    }
    throw error;
  }
}

module.exports = {
  register,
};
