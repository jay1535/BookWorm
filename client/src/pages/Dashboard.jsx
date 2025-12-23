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
import Loading from "./Loading";

const Dashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) {
    return (
      <Loading/>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return user?.role === "Admin" ? <AdminDashboard /> : <UserDashboard />;

      case "Books":
        return <BookManagement />;

      case "Catalog":
        return user?.role === "Admin" ? <Catalog /> : null;

      case "Users":
        return user?.role === "Admin" ? <Users /> : null;

      case "Borrowed Books":
        return <MyBorrowedBooks />;

      default:
        return user?.role === "Admin" ? <AdminDashboard /> : <UserDashboard />;
    }
  };

  return (
    <div className="relative md:flex h-screen md:overflow-hidden bg-gray-100">
      {/* 📂 SIDEBAR */}
      <SideBar setSelectedComponent={setSelectedComponent} />

      {/* 🧩 CONTENT */}
      <main className="flex-1 overflow-visible md:overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
