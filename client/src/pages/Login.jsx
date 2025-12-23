import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();

  const dispatch = useDispatch();

  const { error, message, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  /* ================= HANDLE LOGIN ================= */
  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Please fill all fields");
      return;
    }

    dispatch(login({ email, password }));
  };

  /* ================= TOAST HANDLING ================= */
 useEffect(() => {
  if (message) {
    toast.success(message);
    dispatch(resetAuthSlice());
  }

  if (error) {
    toast.error(error);
    dispatch(resetAuthSlice());
  }
}, [message, error, dispatch]);

useEffect(() => {
  if (isAuthenticated) {
    navigate("/", { replace: true });
  }
}, [isAuthenticated, navigate]);

  return (
   <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center md:items-stretch md:justify-start bg-white text-black">

      {/* ================= LEFT PANEL ================= */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 border border-black/10">
          <div className="flex items-center justify-center gap-4 mb-12">
            <h2 className="text-4xl font-semibold">Welcome Back</h2>
            <img src={logo} alt="Logo" className="w-20" />
          </div>

          <p className="text-black/70 mb-10 text-center">
            Login to continue exploring BookWorm
          </p>

          <form onSubmit={handleLogin} className="space-y-7">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl border border-black/20 focus:outline-none focus:border-black"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-black/20 focus:outline-none focus:border-black"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* ================= FORGOT PASSWORD ================= */}
            <div className="text-right">
              <Link
                to="/password/forgot"
                className="text-sm text-black/60 hover:text-black underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-black text-white font-semibold disabled:opacity-60"
            >
              {loading ? <Loading/> : "Login"}
            </button>
          </form>

          <p className="mt-10 text-center text-black/60 md:hidden">
            Don’t have an account?{" "}
            <Link to="/register" className="underline text-black font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center rounded-tl-[90px] rounded-bl-[90px]">
        <div className="text-center max-w-sm px-10">
          <img
            src={logo_with_title}
            alt="BookWorm"
            className="mx-auto mb-14 h-36 object-contain"
          />

          <p className="text-lg text-white/80 mb-10 flex flex-col">
            New here?
            <span className="text-white/60">
              Create an account and start reading today
            </span>
          </p>

          <Link
            to="/register"
            className="inline-block px-12 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-black transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
