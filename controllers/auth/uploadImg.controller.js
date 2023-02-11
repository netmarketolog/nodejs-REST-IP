const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { User } = require("../../models/user-schema");

const avatarDir = path.join(__dirname, "../../", "public", "avatars");

async function uploadAva(req, res, next) {
  console.log("req.file", req.file);
  const { path: tempUpload, filename } = req.file;
  const { _id } = req.user;
  const avatarURL = path.join(avatarDir, filename);
  await fs.rename(tempUpload, avatarURL);
  const resizedAva = await Jimp.read(avatarURL);
  resizedAva.resize(250, 250).writeAsync(avatarURL);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL,
  });
}

module.exports = {
  uploadAva,
};
