import React, { useEffect, useMemo, useState } from "react";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../store/slices/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "—";
    const date = new Date(timeStamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

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

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 p-6 pt-28 bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading users...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="flex h-full flex-col p-4 pt-28 bg-gray-50 text-black overflow-hidden">
        {/* ================= HEADER ================= */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Registered Users
            </h2>
            <p className="text-sm text-gray-500">
              Manage and view all registered users
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white">
            Total Users: {filteredUsers.length}
          </span>
        </header>

        {/* ================= SEARCH ================= */}
        <div className="mt-4 w-full md:max-w-sm">
          <input
            type="text"
            placeholder="Search by ID, name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-black"
          />
        </div>

        {/* ================= MOBILE VIEW ================= */}
        <div className="mt-6 space-y-4 md:hidden overflow-y-auto">
          {filteredUsers.map((user) => {
            const booksBorrowed =
              user.borrowedBooks?.length ||
              user.booksBorrowed?.length ||
              user.issuedBooks?.length ||
              0;

            return (
              <div
                key={user._id}
                className="rounded-xl bg-white p-4 shadow-md border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold">
                    {user.role}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">User ID</p>
                    <p className="font-mono text-xs">
                      {user._id.slice(0, 8)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Books Borrowed</p>
                    <p className="font-semibold">{booksBorrowed}</p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-gray-500">Registered</p>
                    <p className="text-sm">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        {filteredUsers.length > 0 && (
          <div className="hidden md:flex mt-6 max-h-70 rounded-xl bg-white shadow-md overflow-hidden">

            {/* 🔒 TABLE SCROLL CONTAINER */}
            <div className="w-full overflow-y-auto overflow-x-auto max-h-62">
              {/* 320px ≈ header + 4 rows */}
              <table className="w-full text-left">
                <thead className="bg-black text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-sm">#</th>
                    <th className="px-6 py-4 text-sm">ID</th>
                    <th className="px-6 py-4 text-sm">Name</th>
                    <th className="px-6 py-4 text-sm">Email</th>
                    <th className="px-6 py-4 text-sm">Role</th>
                    <th className="px-6 py-4 text-sm">Books</th>
                    <th className="px-6 py-4 text-sm">Registered</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="border-b last:border-none hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-mono text-sm">
                        {user._id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 font-medium">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {user.borrowedBooks?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {filteredUsers.length === 0 && (
          <div className="mt-10 rounded-xl bg-white p-10 text-center shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              No Users Found
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search.
            </p>
          </div>
        )}
      </main>
    </>
  );
};

export default Users;
