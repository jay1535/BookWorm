import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]); // ✅ 5 digits
  const inputRefs = useRef([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useParams();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  /* ================= OTP INPUT HANDLING ================= */

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 5);
    if (!/^\d+$/.test(pasted)) return;

    setOtp(pasted.split(""));
    inputRefs.current[4].focus();
  };

  /* ================= VERIFY OTP ================= */

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length !== 5) {
      toast.warning("Please enter the complete 5-digit OTP");
      return;
    }

    dispatch(otpVerification(email, finalOtp));
  };

  /* ================= HANDLE RESPONSE ================= */

  useEffect(() => {
    if (message && isAuthenticated) {
      toast.success(message || "OTP verified successfully");
      dispatch(resetAuthSlice());
      navigate("/login");
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [message, error, isAuthenticated, dispatch, navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-black">

      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center rounded-tr-[90px] rounded-br-[90px]">
        <div className="text-center max-w-sm px-10">
          <img
            src={logo_with_title}
            alt="BookWorm"
            className="mx-auto mb-14 h-36 object-contain"
          />
          <p className="text-lg text-white/80 flex flex-col">
            Email Verification
            <span className="text-white/60 mt-2">
              Enter the 5-digit OTP
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 border border-black/10">

          <div className="flex items-center justify-center gap-4 mb-10">
            <h2 className="text-4xl font-semibold">Verify OTP</h2>
            <img src={logo} alt="Logo" className="w-16" />
          </div>

          <p className="text-black/70 mb-10 text-center">
            OTP sent to <br />
            <span className="font-medium text-black">{email}</span>
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-10">
            <div
              className="flex justify-center gap-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="
                    w-12 h-14 text-center text-xl font-semibold
                    rounded-xl border border-black/30
                    focus:outline-none focus:border-black
                    transition
                  "
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-black text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};

export default OTP;
