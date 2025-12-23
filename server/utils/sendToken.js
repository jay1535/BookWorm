export const sendToken = (user, statuscode, message, res) => {
  const token = user.generateToken();

  const isProd = process.env.NODE_ENV === "production";

  res
    .status(statuscode)
    .cookie("token", token, {
      httpOnly: true,
      secure: isProd,                  // ✅ REQUIRED on Render
      sameSite: isProd ? "None" : "Lax",// ✅ REQUIRED for cross-origin
      expires: new Date(
        Date.now() +
          process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      success: true,
      user,
      message,
    });
};
