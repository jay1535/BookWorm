import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { sendToken } from "../utils/sendToken.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";

/* =====================================================
   REGISTER USER
===================================================== */
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  const isRegistered = await User.findOne({
    email,
    accountVerified: true,
  });

  if (isRegistered) {
    return next(new ErrorHandler("User already registered", 400));
  }

  const attempts = await User.find({ email, accountVerified: false });
  if (attempts.length >= 5) {
    return next(
      new ErrorHandler(
        "Maximum registration attempts reached. Try again later.",
        400
      )
    );
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400)
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const verificationCode = user.generateVerificationCode();
  await user.save();

  sendVerificationCode(verificationCode, email, res);
});

/* =====================================================
   VERIFY OTP
===================================================== */
export const verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Email or OTP is missing", 400));
  }

  const users = await User.find({
    email,
    accountVerified: false,
  }).sort({ createdAt: -1 });

  if (!users.length) {
    return next(new ErrorHandler("User not found", 404));
  }

  const user = users[0];

  if (user.verificationCode !== Number(otp)) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  if (Date.now() > user.verificationCodeExpire) {
    return next(new ErrorHandler("OTP expired", 400));
  }

  user.accountVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpire = null;

  await user.save({ validateModifiedOnly: true });

  // 🔥 SEND AVATAR HERE
  sendToken(user, 200, "Account verified successfully", res);
});

/* =====================================================
   LOGIN
===================================================== */
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  const user = await User.findOne({
    email,
    accountVerified: true,
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found or not verified", 404));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // 🔥 SEND AVATAR HERE
  sendToken(user, 200, `Welcome back, ${user.name}`, res);
});

/* =====================================================
   LOGOUT
===================================================== */
export const logout = catchAsyncErrors(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/* =====================================================
   GET LOGGED-IN USER
===================================================== */
export const getUser = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user, // 🔥 avatar already included
  });
});

/* =====================================================
   FORGOT PASSWORD
===================================================== */
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Please provide email", 400));
  }

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

  await sendEmail({
    email: user.email,
    subject: "BookWorm Password Recovery",
    message,
  });

  res.status(200).json({
    success: true,
    message: `Email sent to ${user.email}`,
  });
});

/* =====================================================
   RESET PASSWORD
===================================================== */
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired reset token", 400));
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // 🔥 SEND AVATAR HERE TOO
  sendToken(user, 200, "Password reset successfully", res);
});

/* =====================================================
   UPDATE PASSWORD
===================================================== */
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Current password incorrect", 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
