import express from "express";
import { register, login, logout } from '../controllers/authController.js'

const authRouter = express.Router();
// api/auth/register
authRouter.post("/register", register);
// api/auth/login
authRouter.post("/login", login)
// api/auth/logout
authRouter.post("/logout", logout)

export default authRouter;