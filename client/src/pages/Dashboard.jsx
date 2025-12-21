import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import SideBar from "../layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import Header from "../layout/Header";

const Dashboard = () => {
  const [selectedComponent, setSelectedComponent] = React.useState("Dashboard");

  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  /* ⏳ WAIT FOR AUTH STATE */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="text-gray-500 text-lg">
          Loading Dashboard...
        </span>
      </div>
    );
  }

  /* 🔐 PROTECT DASHBOARD */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /* 🧠 RENDER CONTENT BASED ON SELECTION */
  const renderContent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return user?.role === "Admin" ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        );

      case "Books":
        return user?.role === "Admin" ? (
          <BookManagement />
        ) : (
          <Navigate to="/dashboard" replace />
        );

      case "Catalog":
        return user?.role === "Admin" ? (
          <Catalog />
        ) : (
          <Navigate to="/dashboard" replace />
        );

      case "Users":
        return user?.role === "Admin" ? (
          <Users />
        ) : (
          <Navigate to="/dashboard" replace />
        );

      case "Borrowed Books":
        return <MyBorrowedBooks />;

      default:
        return user?.role === "Admin" ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        );
    }
  };

  return (
    <div className="relative flex min-h-screen bg-gray-100">
      {/* 📂 SIDEBAR (Redux controlled) */}
      <SideBar setSelectedComponent={setSelectedComponent} />

      {/* 🧩 MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
