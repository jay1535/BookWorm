import React, { useEffect, useState } from "react";
import logoWhite from "../assets/logo-with-title.png";
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux";
import {
  addBook,
  clearBookError,
  clearBookMessage,
} from "../store/slices/bookSlice";

const AddBookPopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.book);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    quantity: "",
  });

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  /* ================= CLEAR ERROR ================= */
  useEffect(() => {
    if (error) dispatch(clearBookError());
  }, [error, dispatch]);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, author, description, price, quantity } = form;
    if (!title || !author || !description || !price || !quantity) return;

    dispatch(
      addBook({
        title,
        author,
        description,
        price: Number(price),
        quantity: Number(quantity),
      })
    );

    dispatch(clearBookMessage());
    onClose();
  };

  const inputClass =
    "w-full rounded-lg bg-gray-50 border border-gray-400 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative mx-auto my-6
          w-[95%] max-w-4xl
          max-h-[95vh]
          bg-white rounded-2xl shadow-2xl
          overflow-y-auto
          grid grid-cols-1 md:grid-cols-2
        "
      >
        {/* ================= LEFT PANEL ================= */}
        <div className="bg-black text-white p-6 md:p-10 flex flex-col justify-center items-center text-center">
          <img
            src={logoWhite}
            alt="BookWorm"
            className="h-14 md:h-16 mb-4 select-none"
          />

          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            Add New Book
          </h2>

          <p className="text-gray-300 text-xs md:text-sm max-w-xs">
            Add a new book to the library inventory with complete details.
          </p>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="relative p-6 md:p-10 bg-white overflow-y-auto">
          {/* CLOSE */}
          <button onClick={onClose} className="absolute top-4 right-4">
            <img
              src={closeIcon}
              alt="Close"
              className="w-5 h-5 opacity-70 hover:opacity-100 transition"
            />
          </button>

          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
            Book Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Atomic Habits"
                className={inputClass}
              />
            </div>

            {/* AUTHOR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="James Clear"
                className={inputClass}
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Brief description of the book..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* PRICE & QUANTITY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="299"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="10"
                  className={inputClass}
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 rounded-lg py-3 text-sm font-semibold text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
              }`}
            >
              {loading ? "Adding Book..." : "Add Book"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookPopup;
