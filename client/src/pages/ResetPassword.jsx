import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../store/slices/authSlice";
import Loading from "./Loading";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.warning("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(resetPassword(token, { password, confirmPassword }))
      .then(() => {
        toast.success("Password reset successfully");
        navigate("/login");
      })
      .catch(() => {
        toast.error("Reset link expired or invalid");
      });
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center md:items-stretch md:justify-start bg-white text-black">


      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center rounded-tr-[90px] rounded-br-[90px]">
        <div className="text-center max-w-sm px-10">
          <img
            src={logo_with_title}
            alt="BookWorm"
            className="mx-auto mb-14 h-36 object-contain"
          />

          <p className="text-lg text-white/80 flex flex-col">
            Reset your password
            <span className="text-white/60 mt-2">
              Create a new secure password
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 border border-black/10">

          <div className="flex items-center justify-center gap-4 mb-10">
            <h2 className="text-3xl font-semibold">Reset Password</h2>
            <img src={logo} alt="Logo" className="w-16" />
          </div>

          <p className="text-black/70 mb-8 text-center">
            Enter your new password below
          </p>

          <form onSubmit={handleResetPassword} className="space-y-7">

            {/* NEW PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-black/20 focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-black/20 focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-black text-white font-semibold disabled:opacity-60"
            >
              {loading ? <Loading/> : "Reset Password"}
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

export default ResetPassword;
