import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigin = "https://mern-auth-system-01.vercel.app"

app.use(express.json()); // MIDDLEWARES  all request will be passed by JSON
app.use(cookieParser());
app.use(cors({ origin:allowedOrigin, credentials: true }));

//API Endpoints
app.get("/", (req, res) => res.send("API Working Successfully"));
app.use('/api/auth', authRouter)
app.use("/api/user", userRouter)

// app.listen(port, () => console.log(`Server Started on PORT : ${port}`));

export default app;
