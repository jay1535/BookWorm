import React, { useEffect } from "react";
import logoWhite from "../assets/logo-with-title.png";
import closeIcon from "../assets/close-square.png";
import bookIcon from "../assets/book.png";
import { useDispatch } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";

const ReadBookPopup = ({ book }) => {
  const dispatch = useDispatch();

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && dispatch(toggleReadBookPopup());
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [dispatch]);

  if (!book) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => dispatch(toggleReadBookPopup())}
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
              <h2 className="text-2xl font-semibold">Book Details</h2>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              View complete information about the selected book in the library.
            </p>
          </div>

          <div className="mt-10 space-y-2">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Availability
            </p>

            {book.quantity > 0 ? (
              <span className="inline-flex w-fit rounded-full bg-green-600/20 px-4 py-1 text-sm font-semibold text-green-400">
                Available ({book.quantity})
              </span>
            ) : (
              <span className="inline-flex w-fit rounded-full bg-red-600/20 px-4 py-1 text-sm font-semibold text-red-400">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="relative p-10">
          {/* CLOSE */}
          <button
            onClick={() => dispatch(toggleReadBookPopup())}
            className="absolute top-5 right-5"
          >
            <img
              src={closeIcon}
              alt="Close"
              className="w-6 h-6 opacity-70 hover:opacity-100 transition"
            />
          </button>

          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Book Information
          </h3>

          <div className="space-y-5">
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800">
                {book.title}
              </p>
            </div>

            {/* AUTHOR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800">
                {book.author || "—"}
              </p>
            </div>

            {/* PRICE & QUANTITY */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800">
                  ₹{book.price}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800">
                  {book.quantity}
                </p>
              </div>
            </div>

            {/* DESCRIPTION (4 LINES + SCROLL) */}
            {book.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                  {book.description}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => dispatch(toggleReadBookPopup())}
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-black hover:bg-gray-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadBookPopup;
