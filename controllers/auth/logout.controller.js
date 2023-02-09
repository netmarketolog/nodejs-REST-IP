const { User } = require("../../models/user-schema");
const { Unauthorized } = require("http-errors");

async function logout(req, res, next) {
  const { _id } = req.user;

  const storedUser = await User.findById({
    _id,
  });

  if (!storedUser) {
    throw Unauthorized('"Not authorized"');
  }

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
}

module.exports = { logout };
