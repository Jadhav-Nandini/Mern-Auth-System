import express from "express";
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();
// api/auth/register
authRouter.post("/register", register);
// api/auth/login
authRouter.post("/login", login);
// api/auth/logout
authRouter.post("/logout", logout);
// send the otp to user
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
// verify the account using otp
authRouter.post("/verify-account", userAuth, verifyEmail);
// check whether registered user is there or not
authRouter.post("/is-auth", userAuth, isAuthenticated)
// send reset otp
authRouter.post("/send-reset-otp", sendResetOtp)
// change password 
authRouter.post("/resetPassword", resetPassword)


export default authRouter;

