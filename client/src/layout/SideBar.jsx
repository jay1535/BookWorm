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
import { BookCopy } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import {
  toggleAddNewAdminPopup,
  toggleSettingPopup,
  toggleSidebar,
} from "../store/slices/popUpSlice";

import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";
import Loading from "../pages/Loading";

const SideBar = ({ setSelectedComponent }) => {
  const dispatch = useDispatch();

  const { addNewAdminPopup, sidebarOpen, settingPopup } = useSelector(
    (state) => state.popup
  );

  const { error, message, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [active, setActive] = useState("Dashboard");
  const [loading, setLoading] = useState(false);

  /* ================= TOAST HANDLING ================= */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message]);

  /* ================= DELAY HANDLER ================= */
  const delayedSelect = (component, activeName) => {
    setLoading(true);

    setTimeout(() => {
      setActive(activeName);
      setSelectedComponent(component);
      dispatch(toggleSidebar());
      setLoading(false);
    }, 500); // ⏱ 3 seconds delay
  };

  const menuBase =
    "group relative w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300";

  const activeStyle = "bg-white text-black shadow-xl scale-[1.02]";

  const idleStyle =
    "text-white/70 hover:bg-white/10 hover:translate-x-1";

  return (
    <>
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:relative z-40 h-screen w-72
          bg-linear-to-b from-[#0A0A0A] via-[#121212] to-[#0A0A0A]
          text-white flex flex-col 
          border-r border-white/10 backdrop-blur-xl
          transition-transform duration-500
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* ================= LOGO ================= */}
        <div className="flex flex-col items-center justify-center px-6 py-10 border-b border-white/10">
          <img
            src={logo_with_title}
            alt="BookWorm"
            className="h-28 mb-3 select-none transition-transform duration-300 hover:scale-105"
          />
          <span className="text-xs tracking-widest uppercase text-green-400">
            Manage your books here
          </span>
        </div>

        {/* ================= MENU ================= */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">

          {/* DASHBOARD */}
          <button
            onClick={() => delayedSelect("Dashboard", "Dashboard")}
            className={`${menuBase} ${
              active === "Dashboard" ? activeStyle : idleStyle
            }`}
          >
            {active === "Dashboard" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-black" />
            )}
            <img src={dashboardIcon} className="h-5 w-5" />
            Dashboard
          </button>

          {/* BOOKS */}
          <button
            onClick={() => delayedSelect("Books", "Books")}
            className={`${menuBase} ${
              active === "Books" ? activeStyle : idleStyle
            }`}
          >
            {active === "Books" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-black" />
            )}
            <img src={bookIcon} className="h-5 w-5" />
            Books
          </button>

          {/* ================= ADMIN ONLY ================= */}
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                onClick={() => delayedSelect("Catalog", "Catalog")}
                className={`${menuBase} ${
                  active === "Catalog" ? activeStyle : idleStyle
                }`}
              >
                {active === "Catalog" && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-black" />
                )}
                <img src={catalogIcon} className="h-5 w-5" />
                Catalog
              </button>

              <button
                onClick={() => delayedSelect("Users", "Users")}
                className={`${menuBase} ${
                  active === "Users" ? activeStyle : idleStyle
                }`}
              >
                {active === "Users" && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-black" />
                )}
                <img src={usersIcon} className="h-5 w-5" />
                Users
              </button>

              <button
                onClick={() => dispatch(toggleAddNewAdminPopup())}
                className={`${menuBase} ${idleStyle}`}
              >
                <RiAdminFill className="h-5 w-5" />
                Add New Admin
              </button>
            </>
          )}

          {/* ================= USER ================= */}
          {isAuthenticated && (user?.role === "User" || user?.role === "Admin") && (
            <button
              onClick={() =>
                delayedSelect("Borrowed Books", "Borrowed")
              }
              className={`${menuBase} ${
                active === "Borrowed" ? activeStyle : idleStyle
              }`}
            >
              {active === "Borrowed" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-black" />
              )}
              <BookCopy className="h-5 w-5" />
              My Borrowed Books
            </button>
          )}

          {/* MOBILE SETTINGS */}
          <button
            onClick={() => dispatch(toggleSettingPopup())}
            className="md:hidden mt-6 w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:translate-x-1 transition"
          >
            <img src={settingIcon} className="h-5 w-5" />
            Update Credentials
          </button>
        </nav>

        {/* ================= LOGOUT ================= */}
        <div className="px-6 py-6 border-t border-white/10">
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-3 mx-auto text-sm font-medium text-white/60 hover:text-red-400 hover:scale-105 transition"
          >
            <img src={logoutIcon} className="h-5 w-5" />
            Log Out
          </button>
        </div>

        {/* MOBILE CLOSE */}
        <img
          src={closeIcon}
          alt="close"
          onClick={() => dispatch(toggleSidebar())}
          className="absolute top-5 right-5 h-6 cursor-pointer md:hidden opacity-70 hover:opacity-100 transition"
        />
      </aside>

      {/* ================= POPUPS ================= */}
      {addNewAdminPopup && (
        <AddNewAdmin onClose={() => dispatch(toggleAddNewAdminPopup())} />
      )}

      {settingPopup && (
        <SettingPopup onClose={() => dispatch(toggleSettingPopup())} />
      )}

      {/* ================= LOADER ================= */}
      {loading && <Loading />}
    </>
  );
};

export default SideBar;
