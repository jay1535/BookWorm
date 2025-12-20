import { MenuIcon } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";

const Dashboard = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  /* 🔥 WAIT FOR AUTH CHECK */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }

  /* 🔐 PROTECT ROUTE */
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative flex min-h-screen bg-gray-100">

      {/* MOBILE MENU */}
      <div className="md:hidden z-10 absolute right-6 top-4 flex items-center justify-center bg-black rounded-md h-9 w-9 text-white">
        <MenuIcon onClick={() => setIsSideBarOpen(!isSideBarOpen)} />
      </div>

      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponent={setSelectedComponent}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1">
        {(() => {
          switch (selectedComponent) {
            case "Dashboard":
              return user.role === "Admin"
                ? <AdminDashboard />
                : <UserDashboard />;

            case "Books":
              return <BookManagement />;

            case "Catalog":
              return user.role === "Admin" ? <Catalog /> : null;

            case "Users":
              return user.role === "Admin" ? <Users /> : null;

            case "Borrowed Books":
              return <MyBorrowedBooks />;

            default:
              return user.role === "Admin"
                ? <AdminDashboard />
                : <UserDashboard />;
          }
        })()}
      </div>
    </div>
  );
};

export default Dashboard;
