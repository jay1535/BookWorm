import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { forgotPassword, clearAuthError, clearAuthMessage } from "../store/slices/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Please enter your email address");
      return;
    }

    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (message) {
      toast.success(message || "Reset link sent to your email");
      dispatch(clearAuthMessage());
    }

    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [message, error, dispatch]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-black">

      {/* LEFT PANEL – BRAND */}
      <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center rounded-tr-[90px] rounded-br-[90px]">
        <div className="text-center max-w-sm px-10">
          <img
            src={logo_with_title}
            alt="BookWorm"
            className="mx-auto mb-14 h-36 object-contain"
          />

          <p className="text-lg text-white/80 flex flex-col">
            Forgot your password?
            <span className="text-white/60 mt-2">
              We’ll help you get back in
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL – FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 border border-black/10">

          <div className="flex items-center justify-center gap-4 mb-10">
            <h2 className="text-3xl font-semibold">Forgot Password</h2>
            <img src={logo} alt="Logo" className="w-16" />
          </div>

          <p className="text-black/70 mb-8 text-center">
            Enter your registered email address and we’ll send you a reset link
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-7">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl border border-black/20 focus:outline-none focus:border-black"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-black text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-8 text-center text-black/60">
            Remembered your password?{" "}
            <Link to="/login" className="underline font-medium text-black">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
