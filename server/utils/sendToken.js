export const sendToken = (user, statusCode, message, res) => {
  const token = user.getJWTToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,      
    sameSite: "None", 
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  });

  res.status(statusCode).json({
    success: true,
    message,
    user,
  });
};
