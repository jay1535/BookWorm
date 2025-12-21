import React, { useEffect, useMemo, useState } from "react";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../store/slices/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);

  /* ================= SEARCH STATE ================= */
  const [search, setSearch] = useState("");

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  /* ================= DATE FORMAT ================= */
  const formatDate = (timeStamp) => {
    if (!timeStamp) return "—";

    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;

    const hours = date.getHours();
    const formattedTime = `${String(hours % 12 || 12).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;

    return `${formattedDate} ${formattedTime}`;
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    const keyword = search.toLowerCase();

    return users.filter(
      (u) =>
        u.role?.toLowerCase() === "user" &&
        (u.name?.toLowerCase().includes(keyword) ||
          u.email?.toLowerCase().includes(keyword) ||
          u._id?.toLowerCase().includes(keyword))
    );
  }, [users, search]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 p-6 pt-28 min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading users...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="relative flex-1 p-6 pt-28 bg-gray-50 min-h-screen">
        {/* ================= HEADER ================= */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Registered Users
            </h2>
            <p className="text-sm text-gray-500">
              Manage and view all registered users
            </p>
          </div>

          <span className="inline-flex items-center rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white">
            Total Users: {filteredUsers.length}
          </span>
        </header>

        {/* ================= SEARCH ================= */}
        <div className="mt-4 max-w-sm">
          <input
            type="text"
            placeholder="Search by ID, name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* ================= TABLE ================= */}
        {filteredUsers.length > 0 ? (
          <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-md">
            <table className="w-full border-collapse text-left">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium">#</th>
                  <th className="px-6 py-4 text-sm font-medium">ID</th>
                  <th className="px-6 py-4 text-sm font-medium">Name</th>
                  <th className="px-6 py-4 text-sm font-medium">Email</th>
                  <th className="px-6 py-4 text-sm font-medium">Role</th>
                  <th className="px-6 py-4 text-sm font-medium">
                    Books Borrowed
                  </th>
                  <th className="px-6 py-4 text-sm font-medium">
                    Registered On
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, index) => {
                  const booksBorrowed =
                    user.borrowedBooks?.length ||
                    user.booksBorrowed?.length ||
                    user.issuedBooks?.length ||
                    0;

                  return (
                    <tr
                      key={user._id}
                      className="border-b last:border-none hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {index + 1}
                      </td>

                      {/* ID NAME */}
                      <td className="px-6 py-4 text-sm font-mono text-gray-700">
                        {user._id?.slice(0, 8)}
                      </td>

                      {/* NAME */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.email}
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-800">
                          {user.role}
                        </span>
                      </td>

                      {/* BOOKS BORROWED */}
                      <td className="px-6 py-4 text-sm text-center font-semibold text-gray-800">
                        {booksBorrowed}
                      </td>

                      {/* REGISTERED */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ================= EMPTY ================= */
          <div className="mt-10 flex flex-col items-center justify-center rounded-xl bg-white p-10 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              No Users Found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search.
            </p>
          </div>
        )}
      </main>
    </>
  );
};

export default Users;
