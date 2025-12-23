import React, { useEffect } from "react";
import logoWhite from "../assets/logo-with-title.png";
import closeIcon from "../assets/close-square.png";
import bookIcon from "../assets/book.png";

import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import {
  returnBook,
  clearBorrowMessage,
  clearBorrowError,
} from "../store/slices/borrowSlice";

const ReturnBookPopup = ({ borrow }) => {
  const dispatch = useDispatch();

  const { loading, message, error } = useSelector(
    (state) => state.borrow
  );

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape" && !loading) {
        handleClose();
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [loading]);

  /* ================= AUTO CLOSE ON SUCCESS ================= */
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        handleClose();
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!borrow) return null;

  /* ================= HANDLERS ================= */
  const handleClose = () => {
    if (loading) return;
    dispatch(toggleReturnBookPopup());
    dispatch(clearBorrowMessage());
    dispatch(clearBorrowError());
  };

  const handleReturn = () => {
    dispatch(returnBook(borrow._id));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative mx-auto my-6
          w-[95%] max-w-4xl
          max-h-[95vh]
          bg-white text-black
          rounded-2xl shadow-2xl
          overflow-y-auto
          grid grid-cols-1 md:grid-cols-2
        "
      >
        {/* ================= LEFT PANEL ================= */}
        <div className="bg-black text-white p-6 md:p-10 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <img
              src={logoWhite}
              alt="BookWorm"
              className="h-14 md:h-16 mb-4 select-none"
            />

            <div className="flex items-center gap-3 mb-3">
              <img src={bookIcon} alt="Book" className="w-7 h-7" />
              <h2 className="text-xl md:text-2xl font-semibold">
                Return Book
              </h2>
            </div>

            <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-xs">
              Confirm the return of this book. Any applicable fine
              will be calculated automatically.
            </p>
          </div>

          <div className="mt-8 space-y-2">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Borrowed Book
            </p>
            <p className="text-base md:text-lg font-semibold">
              {borrow.book?.title}
            </p>
            <p className="text-sm text-gray-400">
              Borrowed by: {borrow.user?.email}
            </p>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="relative p-6 md:p-10 overflow-y-auto">
          {/* CLOSE */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4"
            aria-label="Close popup"
          >
            <img
              src={closeIcon}
              alt="Close"
              className="w-5 h-5 opacity-70 hover:opacity-100 transition"
            />
          </button>

          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
            Return Details
          </h3>

          <div className="space-y-4">
            {/* BOOK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book Title
              </label>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold">
                {borrow.book?.title}
              </p>
            </div>

            {/* BORROW DATE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Borrow Date
              </label>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm">
                {new Date(borrow.borrowDate).toLocaleDateString()}
              </p>
            </div>

            {/* DUE DATE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm">
                {new Date(borrow.dueDate).toLocaleDateString()}
              </p>
            </div>

            {/* INFO */}
            <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">
              ⚠️ If the book is returned late, a fine may apply.
            </div>

            {/* SUCCESS */}
            {message && (
              <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
                ✅ {message}
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                ❌ {error}
              </div>
            )}

            {/* ACTION */}
            <button
              onClick={handleReturn}
              disabled={loading}
              className={`w-full mt-4 rounded-lg py-3 text-sm font-semibold text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
              }`}
            >
              {loading ? "Processing..." : "Confirm Return"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnBookPopup;
