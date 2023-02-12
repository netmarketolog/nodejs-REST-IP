const { User } = require("../../models/user-schema");
const { NotFound, BadRequest } = require("http-errors");
const { sendMail } = require("../../middlewares/validateBody");

async function current(req, res, next) {
  const { user } = req;
  const { email, subscription } = user;

  return res.status(200).json({
    data: {
      user: {
        email,
        subscription,
      },
    },
  });
}

async function verifyEmail(req, res, next) {
  const { verificationToken } = req.params;
  const user = await User.findOne({
    verificationToken: verificationToken,
  });

  if (!user) {
    throw NotFound("User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  return res.status(200).json({
    message: "Verification successful",
  });
}

async function resendVerifyEmail(req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw BadRequest("missing required field email");
  }

  if (user.verify) {
    throw BadRequest("Verification has already been passed");
  }

  await sendMail({
    to: email,
    subject: "Please confirm your email",
    html: `<a href="localhost:3000/api/users/verify/${user.verificationToken}">Confirm your email</a>`,
  });

  res.json({
    message: "Verification email sent",
  });
}

module.exports = {
  current,
  verifyEmail,
  resendVerifyEmail,
};
