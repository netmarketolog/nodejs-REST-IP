const express = require("express");

const { tryCatchWrapper } = require("../../helpers/tryCatchWrapper");

const { auth } = require("../../middlewares/validateBody");
const { current } = require("../../controllers/auth/user.controller");

const userRouter = express.Router();

userRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(current));

module.exports = {
  userRouter,
};
