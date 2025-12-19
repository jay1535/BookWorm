import React, { useEffect, useState } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import {toast} from "react-toastify";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const { addNewAdminPopup } = useSelector((state) => state.popup);
  const { loading, error, message, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [active, setActive] = useState("Dashboard");

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  const menuBase =
    "relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300";

  return (
    <>
      <aside
        className={`
          fixed md:relative z-40
          h-screen w-72
          bg-linear-to-b from-[#0A0A0A] via-[#121212] to-[#0A0A0A]
          text-white flex flex-col
          border-r border-white/10
          transition-transform duration-500 ease-in-out
          ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* ================= LOGO ================= */}
        <div className="flex flex-col items-center justify-center px-6 py-10 border-b border-white/10">
          <img
            src={logo_with_title}
            alt="BookWorm"
            className="h-30 mb-2 select-none transition-transform duration-300 hover:scale-105"
          />
          <span className="text-m tracking-wide text-white/50">
            Management
          </span>
        </div>

        {/* ================= MENU ================= */}
        <nav className="flex-1 px-4 py-6 space-y-1">

          {/* Dashboard */}
          <button
            onClick={() => {
              setActive("Dashboard");
              setSelectedComponent("Dashboard");
            }}
            className={`${menuBase} ${
              active === "Dashboard"
                ? "bg-white text-black shadow-lg"
                : "text-white/70 hover:bg-white/10 hover:translate-x-1"
            }`}
          >
            {active === "Dashboard" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-black" />
            )}
            <img src={dashboardIcon} className="h-5 w-5" />
            Dashboard
          </button>

          {/* Books */}
          <button
            onClick={() => {
              setActive("Books");
              setSelectedComponent("Books");
            }}
            className={`${menuBase} ${
              active === "Books"
                ? "bg-white text-black shadow-lg"
                : "text-white/70 hover:bg-white/10 hover:translate-x-1"
            }`}
          >
            <img src={bookIcon} className="h-5 w-5" />
            Books
          </button>

          {/* ADMIN ONLY */}
          {/* {isAuthenticated && user?.role === "User" && (
            <> */}
              <button
                onClick={() => {
                  setActive("Catalog");
                  setSelectedComponent("Catalog");
                }}
                className={`${menuBase} ${
                  active === "Catalog"
                    ? "bg-white text-black shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:translate-x-1"
                }`}
              >
                <img src={catalogIcon} className="h-5 w-5" />
                Catalog
              </button>

              <button
                onClick={() => {
                  setActive("Users");
                  setSelectedComponent("Users");
                }}
                className={`${menuBase} ${
                  active === "Users"
                    ? "bg-white text-black shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:translate-x-1"
                }`}
              >
                <img src={usersIcon} className="h-5 w-5" />
                Users
              </button>

              <button
                onClick={() => dispatch(toggleAddNewAdminPopup())}
                className={`${menuBase} text-white/70 hover:bg-white/10 hover:translate-x-1`}
              >
                <RiAdminFill className="h-5 w-5" />
                Add New Admin
              </button>
            {/* </>
          )} */}

          {/* USER ONLY */}
          {isAuthenticated && user?.role === "User" && (
            <button
              onClick={() => {
                setActive("Borrowed");
                setSelectedComponent("Borrowed Books");
              }}
              className={`${menuBase} text-white/70 hover:bg-white/10 hover:translate-x-1`}
            >
              <img src={catalogIcon} className="h-5 w-5" />
              My Borrowed Books
            </button>
          )}

          {/* Mobile Settings */}
          <button
            onClick={() => dispatch(toggleSettingPopup())}
            className="md:hidden w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:translate-x-1 transition"
          >
            <img src={settingIcon} className="h-5 w-5" />
            Update Credentials
          </button>
        </nav>

        {/* ================= LOGOUT ================= */}
        <div className="px-6 py-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 mx-auto text-sm font-medium text-white/60 hover:text-red-400 hover:scale-105 transition-all"
          >
            <img src={logoutIcon} className="h-5 w-5" />
            Log Out
          </button>
        </div>

        {/* ================= MOBILE CLOSE ================= */}
        <img
          src={closeIcon}
          alt="close"
          onClick={() => setIsSideBarOpen(false)}
          className="absolute top-5 right-5 cursor-pointer md:hidden opacity-70 hover:opacity-100 transition"
        />
      </aside>

      {addNewAdminPopup && <AddNewAdmin />}
    </>
  );
};

export default SideBar;
