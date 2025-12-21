import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

/* ================= GET ALL USERS ================= */
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  res.status(200).json({
    success: true,
    users,
  });
});

/* ================= REGISTER / PROMOTE ADMIN ================= */
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  /* ===== BASIC VALIDATION ===== */
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400)
    );
  }

  /* ===== CHECK EXISTING USER ===== */
  const existingUser = await User.findOne({ email });

  /* =====================================================
     🔹 CASE 1: USER EXISTS → PROMOTE TO ADMIN
     ===================================================== */
  if (existingUser) {
    if (existingUser.role === "Admin") {
      return next(new ErrorHandler("Admin already exists", 400));
    }

    if (!req.files || !req.files.avatar) {
      return next(new ErrorHandler("Please upload a profile picture", 400));
    }

    const { avatar } = req.files;
    const allowedFormat = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedFormat.includes(avatar.mimetype)) {
      return next(new ErrorHandler("Invalid file format", 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      { folder: "Bookworm_avatars" }
    );

    if (!cloudinaryResponse) {
      return next(new ErrorHandler("Cloudinary upload failed", 500));
    }

    existingUser.role = "Admin";
    existingUser.accountVerified = true;
    existingUser.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };

    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "User promoted to Admin successfully",
      user: existingUser,
    });
  }

  /* =====================================================
     🔹 CASE 2: CREATE BRAND NEW ADMIN
     ===================================================== */
  if (!req.files || !req.files.avatar) {
    return next(new ErrorHandler("Please upload a profile picture", 400));
  }

  const { avatar } = req.files;
  const allowedFormat = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedFormat.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Invalid file format", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: "Bookworm_avatars" }
  );

  if (!cloudinaryResponse) {
    return next(new ErrorHandler("Cloudinary upload failed", 500));
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    user,
  });
});
