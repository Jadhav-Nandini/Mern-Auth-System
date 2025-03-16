import express from "express";
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();
// api/auth/register
authRouter.post("/register", register);
// api/auth/login
authRouter.post("/login", login);
// api/auth/logout
authRouter.post("/logout", logout);

authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
// verify the account using otp
authRouter.post("/verify-account", userAuth, verifyEmail);


export default authRouter;

