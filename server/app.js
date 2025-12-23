import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";

import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";

import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";

import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";

/* =====================================================
   LOAD ENV VARIABLES
===================================================== */
config({ path: "./config/config.env" });

export const app = express();

/* =====================================================
   CORE MIDDLEWARES (ORDER MATTERS)
===================================================== */

// 🔥 CORS — STATIC ORIGIN (DO NOT USE FUNCTION)
app.use(
  cors({
    origin: "https://bookworm-steel.vercel.app", // ✅ EXACT frontend URL
    credentials: true,
  })
);

// 🔥 COOKIE PARSER — MUST COME BEFORE ROUTES
app.use(cookieParser());

// 🔥 BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 FILE UPLOADS
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// 🔥 STATIC FILES
app.use(express.static(path.join(process.cwd(), "public")));

/* =====================================================
   ROUTES
===================================================== */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

/* =====================================================
   SERVICES & DATABASE
===================================================== */
notifyUsers();
removeUnverifiedAccounts();
connectDB();

/* =====================================================
   ERROR HANDLER (LAST)
===================================================== */
app.use(errorMiddleware);
