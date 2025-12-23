import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaBars } from "react-icons/fa";
import { toggleSettingPopup, toggleSidebar } from "../store/slices/popUpSlice";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);

  /* ================= TIME ================= */
  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );

      setCurrentDate(
        now.toLocaleDateString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateTimeAndDate();
    const interval = setInterval(updateTimeAndDate, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setShowAvatar(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <>
      <header className="w-full h-16 px-4 bg-white text-black flex items-center justify-between sticky top-0 z-30 shadow-sm">
        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-4">
          {/* AVATAR (CLICKABLE) */}
          <div
            onClick={() => setShowAvatar(true)}
            className="cursor-pointer"
          >
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border hover:scale-105 transition"
              />
            ) : (
              <FaUser className="w-10 h-10 p-2 border rounded-full text-gray-500 hover:scale-105 transition" />
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-sm sm:text-lg lg:text-xl font-semibold">
              {user?.name || "Guest"}
            </span>
            <span className="text-xs sm:text-sm text-gray-400 font-medium">
              {user?.role || "User"}
            </span>
          </div>
        </div>

        {/* ☰ SIDEBAR TOGGLE (MOBILE) */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-md hover:bg-gray-100 transition md:hidden"
        >
          <FaBars className="w-5 h-5" />
        </button>

        {/* ================= RIGHT ================= */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end font-semibold">
            <span className="text-sm text-gray-800 tracking-wide">
              {currentTime}
            </span>
            <span className="text-sm text-gray-800 tracking-wide">
              {currentDate}
            </span>
          </div>

          {/* SETTINGS */}
          <div
            onClick={() => dispatch(toggleSettingPopup())}
            className="border rounded-full cursor-pointer hover:bg-gray-100 transition"
          >
            <img
              src={settingIcon}
              alt="Settings"
              className="w-8 h-8 p-1"
            />
          </div>
        </div>
      </header>

      {/* ================= AVATAR MODAL ================= */}
      {showAvatar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAvatar(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-4"
          >
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                className="w-60 h-60 rounded-full object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <FaUser className="w-60 h-60 p-8 rounded-full bg-white text-gray-400 shadow-xl" />
            )}

            <div className="text-center">
              <p className="text-white text-xl font-semibold">
                {user?.name || "Guest"}
              </p>
              <p className="text-gray-300 text-sm">
                {user?.role || "User"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
