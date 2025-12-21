import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaBars } from "react-icons/fa";
import { toggleSettingPopup, toggleSidebar } from "../store/slices/popUpSlice";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const dispatch = useDispatch();

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
    const intervalId = setInterval(updateTimeAndDate, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="w-full h-16 px-4 bg-white text-black flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-4">
        {/* AVATAR */}
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border"
          />
        ) : (
          <FaUser className="w-10 h-10 p-2 border rounded-full text-gray-500" />
        )}

        <div className="flex flex-col">
          <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
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
      <div className="hidden md:flex items-center justify-center gap-6">
        <div className="flex flex-col text-sm lg:text-base items-end font-semibold">
          <span className="text-sm font-semibold text-gray-800 tracking-wide">
            {currentTime}
          </span>
          <span className="text-sm font-semibold text-gray-800 tracking-wide">
            {currentDate}
          </span>
        </div>

        {/* SETTINGS */}
        <div
          className="border rounded-full cursor-pointer hover:bg-gray-100 transition"
          onClick={() => dispatch(toggleSettingPopup())}
        >
          <img
            src={settingIcon}
            alt="Settings"
            className="w-8 h-8 p-1"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
