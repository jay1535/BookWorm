import React, { useEffect } from "react";
import logoWhite from "../assets/logo-with-title.png";
import closeIcon from "../assets/close-square.png";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBook } from "../store/slices/bookSlice";
import { toggleDeleteBookPopup } from "../store/slices/popUpSlice";

/**
 * props:
 *  - bookId   : ID of the book to delete
 *  - bookTitle: title to show in warning (optional but recommended)
 */
const DeleteBookPopup = ({ bookId, bookTitle }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.book);

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && dispatch(toggleDeleteBookPopup());
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [dispatch]);

  /* ================= CONFIRM DELETE ================= */
  const handleDelete = () => {
    if (!bookId) return;

    dispatch(deleteBook(bookId));
    dispatch(toggleDeleteBookPopup());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => dispatch(toggleDeleteBookPopup())}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-y-auto grid grid-cols-1 md:grid-cols-2"
      >
        {/* ================= LEFT PANEL ================= */}
        <div className="bg-black text-white p-10 flex flex-col justify-center items-center text-center">
          <img
            src={logoWhite}
            alt="BookWorm"
            className="h-16 mb-6 select-none"
          />

          <div className="flex items-center gap-2 mb-4 text-red-400">
            <AlertTriangle size={28} />
            <h2 className="text-2xl font-semibold">Delete Book</h2>
          </div>

          <p className="text-gray-300 text-sm max-w-xs">
            This action is <span className="text-red-400 font-semibold">permanent</span>.
            The book will be removed from the system and cannot be recovered.
          </p>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="relative p-10 bg-white">
          {/* CLOSE */}
          <button
            onClick={() => dispatch(toggleDeleteBookPopup())}
            className="absolute top-5 right-5"
          >
            <img
              src={closeIcon}
              alt="Close"
              className="w-6 h-6 opacity-70 hover:opacity-100 transition"
            />
          </button>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Confirm Deletion
          </h3>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-700">
              Are you sure you want to delete
              <span className="font-semibold">
                {bookTitle ? ` "${bookTitle}"` : " this book"}
              </span>
              ?
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => dispatch(toggleDeleteBookPopup())}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <Trash2 size={16} />
              {loading ? "Deleting..." : "Delete Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookPopup;
