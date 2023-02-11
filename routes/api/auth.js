const express = require("express");

const { register } = require("../../controllers/auth/register.controller");
const { login } = require("../../controllers/auth/login.controller");
const { logout } = require("../../controllers/auth/logout.controller");
const { uploadAva } = require("../../controllers/auth/uploadImg.controller");

const { tryCatchWrapper } = require("../../helpers/tryCatchWrapper");
const { auth, upload } = require("../../middlewares/validateBody");

const authRouter = express.Router();

authRouter.post("/users/register", tryCatchWrapper(register));
authRouter.get("/users/login", tryCatchWrapper(login));
authRouter.post(
  "/users/logout",
  tryCatchWrapper(auth),
  tryCatchWrapper(logout)
);
authRouter.patch(
  "/users/avatars",
  tryCatchWrapper(auth),
  upload.single("avatar"),
  tryCatchWrapper(uploadAva)
);

module.exports = {
  authRouter,
};
