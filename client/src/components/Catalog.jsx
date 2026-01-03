import React, { useEffect, useMemo, useState } from "react";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";

import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";

import {
  fetchAllBooks,
  clearBookError,
} from "../store/slices/bookSlice";

import {
  fetchAllBorrowedBooks,
} from "../store/slices/borrowSlice";

import {
  toggleRecordBookPopup,
  toggleReturnBookPopup,
} from "../store/slices/popUpSlice";

import RecordBookPopup from "../popups/RecordBookPopup";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Loading from "../pages/Loading";

const Catalog = () => {
  const dispatch = useDispatch();

  const { books, loading, error } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);
  const { recordBookPopup, returnBookPopup } = useSelector(
    (state) => state.popup
  );

  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBorrow, setSelectedBorrow] = useState(null);

  /* 🔹 live time for fine */
  const [now, setNow] = useState(Date.now());

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  /* 🔹 re-render every minute */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  /* ================= CLEAR ERROR ================= */
  useEffect(() => {
    if (error) dispatch(clearBookError());
  }, [error, dispatch]);

  /* ================= DATE (DD-MM-YYYY) ================= */
  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  /* ================= LIVE FINE ================= */
  const calculateLiveFine = (dueDate) => {
    const today = new Date(now);
    const due = new Date(dueDate);

    if (due >= today) return 0;

    const finePerDay = 5;
    const daysLate = Math.ceil(
      (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Number((daysLate * finePerDay).toFixed(2));
  };

  /* ================= FILTER BORROWS ================= */
  const filteredBorrows = useMemo(() => {
    const key = search.toLowerCase();

    return allBorrowedBooks?.filter(
      (b) =>
        b.book.title.toLowerCase().includes(key) ||
        b.user.email.toLowerCase().includes(key)
    );
  }, [allBorrowedBooks, search]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Header />

      {recordBookPopup && selectedBook && (
        <RecordBookPopup book={selectedBook} />
      )}

      {returnBookPopup && selectedBorrow && (
        <ReturnBookPopup borrow={selectedBorrow} />
      )}

      <main className="min-h-screen bg-gray-50 text-black pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-6 space-y-12">

          {/* TITLE */}
          <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Library Catalog
              </h1>
              <p className="mt-2 text-gray-600 max-w-xl">
                All borrowed books (user-wise)
              </p>
            </div>

            <div className="w-full md:w-80">
              <input
                type="text"
                placeholder="Search by book or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </div>
          </section>

          {/* BORROW GRID */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBorrows.map((borrow) => (
              <div
                key={borrow._id}
                className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 flex flex-col justify-between transition hover:shadow-lg"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {borrow.book.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Borrowed by {borrow.user.email}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    Due date: {formatDate(borrow.dueDate)}
                  </p>

                  {!borrow.returnDate && (
                    <p className="mt-2 font-semibold text-red-600">
                      Fine: ₹{calculateLiveFine(borrow.dueDate)}
                    </p>
                  )}

                  {borrow.returnDate && (
                    <p className="mt-2 font-semibold text-green-600">
                      Returned on {formatDate(borrow.returnDate)}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  {!borrow.returnDate ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      <PiKeyReturnBold />
                      Borrowed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      <FaSquareCheck />
                      Returned
                    </span>
                  )}

                  {!borrow.returnDate && (
                    <button
                      onClick={() => {
                        setSelectedBorrow(borrow);
                        dispatch(toggleReturnBookPopup());
                      }}
                      className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                    >
                      Return
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
};

export default Catalog;
