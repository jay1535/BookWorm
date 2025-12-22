import React, { useEffect, useMemo, useState } from "react";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  Clock,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import {
  fetchUserBorrowedBooks,
} from "../store/slices/borrowSlice";

import {
  toggleReturnBookPopup,
} from "../store/slices/popUpSlice";

import ReturnBookPopup from "../popups/ReturnBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  const { userBorrowedBooks, loading } = useSelector(
    (state) => state.borrow
  );

  const { returnBookPopup } = useSelector(
    (state) => state.popup
  );

  const [search, setSearch] = useState("");
  const [selectedBorrow, setSelectedBorrow] = useState(null);

  /* ================= FETCH BORROWED BOOKS ================= */
  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  /* ================= DATE FORMAT ================= */
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  /* ================= STATUS ================= */
  const getStatus = (item) => {
    if (item.returnDate) return "Returned";
    if (new Date() > new Date(item.dueDate)) return "Overdue";
    return "Active";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Returned":
        return "bg-gray-200 text-gray-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Returned":
        return <RotateCcw size={14} />;
      case "Overdue":
        return <AlertCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  /* ================= SEARCH ================= */
  const filteredBorrowedBooks = useMemo(() => {
    if (!Array.isArray(userBorrowedBooks)) return [];
    const keyword = search.toLowerCase();

    return userBorrowedBooks.filter(
      (b) => b.book?.title?.toLowerCase().includes(keyword)
    );
  }, [userBorrowedBooks, search]);

  /* ================= OPEN RETURN POPUP ================= */
  const openReturnPopup = (borrow) => {
    setSelectedBorrow(borrow);
    dispatch(toggleReturnBookPopup());
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 p-6 pt-28 bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500 text-lg">
            Loading borrowed books...
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* ================= RETURN POPUP ================= */}
      {returnBookPopup && selectedBorrow && (
        <ReturnBookPopup borrow={selectedBorrow} />
      )}

      <main className="flex h-full flex-col p-4 pt-28 bg-gray-50 text-black overflow-hidden">
        {/* ================= HEADER ================= */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              My Borrowed Books
            </h2>
            <p className="text-sm text-gray-500">
              View your borrowed books and due dates
            </p>
          </div>

          <span className="inline-flex items-center rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white">
            Total: {filteredBorrowedBooks.length}
          </span>
        </header>

        {/* ================= SEARCH ================= */}
        <div className="mt-4 w-full md:max-w-sm">
          <input
            type="text"
            placeholder="Search by book name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-black"
          />
        </div>

        {/* ================= EMPTY ================= */}
        {filteredBorrowedBooks.length === 0 && (
          <div className="mt-10 rounded-xl bg-white p-10 text-center shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              No Borrowed Books
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              You haven’t borrowed any books yet.
            </p>
          </div>
        )}

        {/* ================= MOBILE VIEW ================= */}
        <div className="mt-6 space-y-4 md:hidden overflow-y-auto">
          {filteredBorrowedBooks.map((item) => {
            const status = getStatus(item);

            return (
              <div
                key={item._id}
                className="rounded-xl bg-white p-4 shadow-md border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.book?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Borrowed: {formatDate(item.borrowDate)}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusStyle(
                      status
                    )}`}
                  >
                    {getStatusIcon(status)}
                    {status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Due Date</p>
                    <p className="font-medium">
                      {formatDate(item.dueDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Fine</p>
                    <p className="font-semibold">
                      ₹{item.fine ?? 0}
                    </p>
                  </div>
                </div>

                {status === "Active" && (
                  <button
                    onClick={() => openReturnPopup(item)}
                    className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition"
                  >
                    Return Book
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        {filteredBorrowedBooks.length > 0 && (
          <div className="hidden md:block mt-6 rounded-xl bg-white shadow-md">
            <div className="max-h-70 overflow-y-auto rounded-xl">
              <table className="w-full text-left">
                <thead className="bg-black text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Book</th>
                    <th className="px-6 py-4">Borrowed</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Fine</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBorrowedBooks.map((item, index) => {
                    const status = getStatus(item);

                    return (
                      <tr
                        key={item._id}
                        className="border-b last:border-none hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">{index + 1}</td>

                        <td className="px-6 py-4 font-medium">
                          {item.book?.title}
                        </td>

                        <td className="px-6 py-4">
                          {formatDate(item.borrowDate)}
                        </td>

                        <td className="px-6 py-4">
                          {formatDate(item.dueDate)}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              status
                            )}`}
                          >
                            {getStatusIcon(status)}
                            {status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center font-semibold">
                          ₹{item.fine ?? 0}
                        </td>

                        <td className="px-6 py-4 text-center">
                          {status === "Active" ? (
                            <button
                              onClick={() => openReturnPopup(item)}
                              className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900 transition"
                            >
                              Return
                            </button>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default MyBorrowedBooks;
