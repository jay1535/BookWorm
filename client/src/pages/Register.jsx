import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import Loading from "./Loading";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, message, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.warning("Please fill all fields");
      return;
    }

    dispatch(register({ name, email, password }));
  };

  useEffect(() => {
    if (message) {
      navigate(`/otp-verification/${email}`);
      dispatch(resetAuthSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [message, error, dispatch, navigate, email]);

  if (isAuthenticated) return <Navigate to="/" replace />;

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

          <p className="text-lg text-white/80 mb-10 flex flex-col">
            Already have an account?
            <span className="text-white/60">
              Start your journey by signing in
            </span>
          </p>

          <Link
            to="/login"
            className="inline-block px-12 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-black transition"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 border border-black/10">

          <div className="flex items-center justify-center gap-4 mb-12">
            <h2 className="text-4xl font-semibold">Sign up</h2>
            <img src={logo} alt="Logo" className="w-20" />
          </div>

          <p className="text-black/70 mb-10 text-center">
            Create your account to start your journey
          </p>

          <form onSubmit={handleRegister} className="space-y-7">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl border border-black/20 
                         placeholder:text-black/40
                         focus:outline-none focus:border-black"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl border border-black/20 
                         placeholder:text-black/40
                         focus:outline-none focus:border-black"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-black/20 
                           placeholder:text-black/40
                           focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-black text-white font-semibold disabled:opacity-60"
            >
              {loading ? <Loading/> : "Create Account"}
            </button>
          </form>

          <p className="mt-10 text-center text-black/60 md:hidden">
            Already have an account?{" "}
            <Link to="/login" className="underline text-black font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
