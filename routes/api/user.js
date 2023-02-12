const express = require("express");

const { tryCatchWrapper } = require("../../helpers/tryCatchWrapper");

const { auth } = require("../../middlewares/validateBody");
const {
  current,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/auth/user.controller");

const userRouter = express.Router();

userRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(current));
userRouter.get("/verify/:verificationToken", tryCatchWrapper(verifyEmail));
userRouter.post("/verify", tryCatchWrapper(resendVerifyEmail));

module.exports = {
  userRouter,
};
