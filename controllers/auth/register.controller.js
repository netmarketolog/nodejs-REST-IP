const { User } = require("../../models/user-schema");
const { Conflict } = require("http-errors");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const { v4 } = require("uuid");
const { sendMail } = require("../../middlewares/validateBody");

async function register(req, res, next) {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatarURL = gravatar.url(email);
  const verificationToken = v4();

  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
      verify: false,
    });

    await sendMail({
      to: email,
      subject: "Please confirm your email",
      html: `<a href="localhost:3000/api/users/verify/${verificationToken}">Confirm your email</a>`,
    });

    res.status(201).json({
      data: {
        user: {
          email,
          subscription: savedUser.subscription,
        },
      },
    });
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
