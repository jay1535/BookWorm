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
   LOAD ENV VARIABLES (IMPORTANT)
===================================================== */
config({ path: "./config/config.env" });

export const app = express();

/* =====================================================
   MIDDLEWARES
===================================================== */
const allowedOrigins = [
   "https://bookworm-steel.vercel.app",
  "https://bookworm.intellidocs.in",
  "https://www.bookworm.intellidocs.in",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(express.static(path.join(process.cwd(), "public")));

/* =====================================================
   ROUTES
===================================================== */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

/* =====================================================
   SERVICES & DB
===================================================== */
notifyUsers();
removeUnverifiedAccounts();
connectDB();

/* =====================================================
   ERROR HANDLER
===================================================== */
app.use(errorMiddleware);
