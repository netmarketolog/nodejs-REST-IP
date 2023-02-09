const express = require("express");

const { register } = require("../../controllers/auth/register.controller");
const { login } = require("../../controllers/auth/login.controller");
const { logout } = require("../../controllers/auth/logout.controller");

const { tryCatchWrapper } = require("../../helpers/tryCatchWrapper");
const { auth } = require("../../middlewares/validateBody");

const authRouter = express.Router();

authRouter.post("/users/register", tryCatchWrapper(register));
authRouter.get("/users/login", tryCatchWrapper(login));
authRouter.post(
  "/users/logout",
  tryCatchWrapper(auth),
  tryCatchWrapper(logout)
);

module.exports = {
  authRouter,
};
