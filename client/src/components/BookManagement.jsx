import React, { useEffect, useMemo, useState } from "react";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllBooks,
  clearBookError,
  clearBookMessage,
} from "../store/slices/bookSlice";

import {
  toggleAddBookPopup,
  toggleDeleteBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";

import AddBookPopup from "../popups/AddBookPopup";
import DeleteBookPopup from "../popups/DeleteBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";

import {
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  ClipboardPlus,
} from "lucide-react";

const BookManagement = () => {
  const dispatch = useDispatch();

  const { books, loading, error, message } = useSelector(
    (state) => state.book
  );

  const {
    addBookPopup,
    deleteBookPopup,
    readBookPopup,
    recordBookPopup,
  } = useSelector((state) => state.popup);

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "Admin";

  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  /* ================= FETCH BOOKS ================= */
  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  /* ================= CLEAR ERRORS / MESSAGE ================= */
  useEffect(() => {
    if (error) dispatch(clearBookError());
    if (message) dispatch(clearBookMessage());
  }, [error, message, dispatch]);

  /* ================= SEARCH ================= */
  const filteredBooks = useMemo(() => {
    if (!Array.isArray(books)) return [];
    const keyword = search.toLowerCase();

    return books.filter(
      (b) =>
        b.title?.toLowerCase().includes(keyword) ||
        b.author?.toLowerCase().includes(keyword)
    );
  }, [books, search]);

  /* ================= OPEN POPUPS ================= */
  const openDeletePopup = (book) => {
    setSelectedBook(book);
    dispatch(toggleDeleteBookPopup());
  };

  const openReadPopup = (book) => {
    setSelectedBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openRecordPopup = (book) => {
    setSelectedBook(book);
    dispatch(toggleRecordBookPopup());
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 p-6 pt-28 bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading books...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* ================= POPUPS ================= */}
      {addBookPopup && isAdmin && (
        <AddBookPopup onClose={() => dispatch(toggleAddBookPopup())} />
      )}

      {deleteBookPopup && selectedBook && isAdmin && (
        <DeleteBookPopup
          bookId={selectedBook._id}
          bookTitle={selectedBook.title}
        />
      )}

      {readBookPopup && selectedBook && (
        <ReadBookPopup book={selectedBook} />
      )}

      {recordBookPopup && selectedBook && isAdmin && (
        <RecordBookPopup book={selectedBook} />
      )}

      <main className="flex h-full flex-col p-4 pt-28 bg-gray-50 text-black overflow-hidden">
        {/* ================= HEADER ================= */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Book Management
            </h2>
            <p className="text-sm text-gray-500">
              View and manage library books
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white">
              Total Books: {filteredBooks.length}
            </span>

            {isAdmin && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
              >
                <Plus size={16} />
                Add Book
              </button>
            )}
          </div>
        </header>

        {/* ================= SEARCH ================= */}
        <div className="mt-4 w-full md:max-w-sm">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-black"
          />
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        {filteredBooks.length > 0 && (
  <div className="hidden md:block mt-6 rounded-2xl bg-white shadow-md">
    {/* TABLE WRAPPER FOR SCROLL */}
    <div className="max-h-70 overflow-y-auto rounded-2xl">
      <table className="w-full text-left">
        <thead className="bg-black text-white sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4">#</th>
            <th className="px-6 py-4">Book</th>
            <th className="px-6 py-4">Author</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4 text-center">Quantity</th>
            <th className="px-6 py-4 text-center">Status</th>

            {/* 🔐 ADMIN ONLY */}
            {isAdmin && (
              <th className="px-6 py-4 text-center">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {filteredBooks.map((book, index) => (
            <tr
              key={book._id}
              className="border-b last:border-none hover:bg-gray-50"
            >
              <td className="px-6 py-4">{index + 1}</td>

              <td
                className="px-6 py-4 text-blue-600 cursor-pointer font-medium"
                onClick={() => openReadPopup(book)}
              >
                {book.title}
              </td>

              <td className="px-6 py-4">{book.author}</td>
              <td className="px-6 py-4">₹{book.price}</td>

              <td className="px-6 py-4 text-center">
                {book.quantity}
              </td>

              <td className="px-6 py-4 text-center">
                {book.quantity > 0 ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Available
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Out of Stock
                  </span>
                )}
              </td>

              {/* 🔐 ADMIN ONLY */}
              {isAdmin && (
                <td className="px-6 py-4 flex justify-center gap-3">
                  <button
                    onClick={() => openRecordPopup(book)}
                    className="text-blue-600"
                  >
                    <ClipboardPlus size={16} />
                  </button>

                  <button
                    onClick={() => openDeletePopup(book)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
{/* ================= MOBILE VIEW ================= */}
<div className="mt-6 space-y-4 md:hidden">
  {filteredBooks.map((book) => (
    <div
      key={book._id}
      className="rounded-xl bg-white p-4 shadow-md border"
    >
      {/* TITLE + STATUS */}
      <div className="flex justify-between items-start">
        <div
          className="cursor-pointer"
          onClick={() => openReadPopup(book)}
        >
          <p className="font-semibold text-gray-800">
            {book.title}
          </p>
          <p className="text-xs text-gray-500">
            {book.author}
          </p>
        </div>

        {book.quantity > 0 ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Available
          </span>
        ) : (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Out
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Price</p>
          <p className="font-semibold">₹{book.price}</p>
        </div>

        <div>
          <p className="text-gray-500">Quantity</p>
          <p className="font-semibold">{book.quantity}</p>
        </div>
      </div>

      {/* ACTIONS (ADMIN ONLY) */}
      {isAdmin && (
        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={() => openRecordPopup(book)}
            className="text-blue-600 flex items-center gap-1 text-sm font-medium"
          >
            <ClipboardPlus size={16} />
            Borrow
          </button>

          <button
            onClick={() => openDeletePopup(book)}
            className="text-red-600 flex items-center gap-1 text-sm font-medium"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  ))}
</div>



        {/* ================= EMPTY ================= */}
        {filteredBooks.length === 0 && (
          <div className="mt-10 rounded-xl bg-white p-10 text-center shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              No Books Found
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

export default BookManagement;
