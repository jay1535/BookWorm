import React, { useEffect, useState } from "react";
import logoWhite from "../assets/logo-with-title.png";
import closeIcon from "../assets/close-square.png";
import bookIcon from "../assets/book.png";
import { useDispatch, useSelector } from "react-redux";

import { toggleRecordBookPopup } from "../store/slices/popUpSlice";
import {
  recordBorrowBook,
  clearBorrowMessage,
  clearBorrowError,
} from "../store/slices/borrowSlice";

const RecordBookPopup = ({ book }) => {
  const dispatch = useDispatch();

  const { loading, message, error } = useSelector(
    (state) => state.borrow
  );

  const [email, setEmail] = useState("");

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape" && !loading) {
        dispatch(toggleRecordBookPopup());
        dispatch(clearBorrowMessage());
        dispatch(clearBorrowError());
      }
    };

    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [dispatch, loading]);

  /* ================= AUTO CLOSE ON SUCCESS ================= */
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(toggleRecordBookPopup());
        dispatch(clearBorrowMessage());
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!book) return null;

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || book.quantity === 0) return;

    dispatch(
      recordBorrowBook({
        bookId: book._id,
        email,
      })
    );
  };

  /* ================= CLOSE HANDLER ================= */
  const handleClose = () => {
    if (loading) return;

    dispatch(toggleRecordBookPopup());
    dispatch(clearBorrowMessage());
    dispatch(clearBorrowError());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white text-black rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* ================= LEFT PANEL ================= */}
        <div className="bg-black text-white p-10 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <img
              src={logoWhite}
              alt="BookWorm"
              className="h-16 mb-6 select-none"
            />

            <div className="flex items-center gap-3 mb-4">
              <img src={bookIcon} alt="Book" className="w-8 h-8" />
              <h2 className="text-2xl font-semibold">Borrow Book</h2>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Record a new borrowing entry. Please verify the user
              email before submission.
            </p>
          </div>

          <div className="mt-10 space-y-2">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Selected Book
            </p>
            <p className="text-lg font-semibold">{book.title}</p>
            <p className="text-sm text-gray-400">
              Available: {book.quantity}
            </p>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="relative p-10">
          {/* CLOSE */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5"
            aria-label="Close popup"
          >
            <img
              src={closeIcon}
              alt="Close"
              className="w-6 h-6 opacity-70 hover:opacity-100 transition"
            />
          </button>

          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Borrow Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* BOOK TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book Title
              </label>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800">
                {book.title}
              </p>
            </div>

            {/* USER EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Email
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            {/* INFO */}
            <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">
              <p>📅 Borrow duration: <strong>7 days</strong></p>
              <p className="mt-1">
                💰 Fine may apply if returned late.
              </p>
            </div>

            {/* SUCCESS MESSAGE */}
            {message && (
              <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
                ✅ {message}
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                ❌ {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading || book.quantity === 0}
              className={`w-full mt-4 rounded-lg py-3 text-sm font-semibold text-white transition ${
                loading || book.quantity === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
              }`}
            >
              {loading ? "Recording..." : "Confirm Borrow"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecordBookPopup;
