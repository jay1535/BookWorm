import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();

      const timeOptions = {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };

      const dateOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      setCurrentTime(now.toLocaleTimeString([], timeOptions));
      setCurrentDate(now.toLocaleDateString([], dateOptions));
    };

    updateTimeAndDate();
    const intervalId = setInterval(updateTimeAndDate, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="w-full h-16 px-4 bg-white flex items-center justify-between sticky top-0 z-30 shadow-sm">

      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-3">
        
        <FaUser className="w-10 h-10 p-1 border rounded-full"/>
        <div className="flex flex-col">
          <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
            {/* {user && user.name} */}
            Jay
            
          </span>
          <span className="text-sm   text-gray-400 sm:text-sm sm:font-medium">
            {/* {user && user.role} */}
            Admin
           
          </span>
        </div>
      </div>

      {/* ================= CENTER ================= */}
      <div className="hidden md:flex flex-col items-center">
        <span className="text-sm font-semibold text-gray-800 tracking-wide">
          {currentTime}
        </span>
        <span className="text-[11px] uppercase tracking-wider text-gray-400">
          Local Time
        </span>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-4">

        {/* Settings */}
        <button
          className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
          title="Settings"
        >
          <img
            src={settingIcon}
            alt="settings"
            className="h-5 w-5 opacity-70"
          />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
          <FaUser className="w-10 h-10 p-1"/>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-medium text-gray-900 leading-none">
              {user?.role || "User"}
            </span>
            <span className="text-[11px] text-gray-500">
              Account
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
