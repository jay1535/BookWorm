import React, { useEffect, useMemo, useState } from "react";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";

import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";

import {
  fetchAllBooks,
  clearBookError,
} from "../store/slices/bookSlice";

import { toggleRecordBookPopup } from "../store/slices/popUpSlice";
import RecordBookPopup from "../popups/RecordBookPopup";

const Catalog = () => {
  const dispatch = useDispatch();

  const { books, loading, error } = useSelector((state) => state.book);
  const { recordBookPopup } = useSelector((state) => state.popup);

  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  /* ================= FETCH BOOKS ================= */
  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  /* ================= CLEAR ERROR ================= */
  useEffect(() => {
    if (error) dispatch(clearBookError());
  }, [error, dispatch]);

  /* ================= SEARCH ================= */
  const filteredBooks = useMemo(() => {
    if (!Array.isArray(books)) return [];
    const key = search.toLowerCase();

    return books.filter(
      (b) =>
        b.title?.toLowerCase().includes(key) ||
        b.author?.toLowerCase().includes(key)
    );
  }, [books, search]);

  /* ================= BORROW ================= */
  const handleBorrow = (book) => {
    setSelectedBook(book);
    dispatch(toggleRecordBookPopup());
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading catalog…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* ================= BORROW POPUP ================= */}
      {recordBookPopup && selectedBook && (
        <RecordBookPopup book={selectedBook} />
      )}

      <main className="min-h-screen bg-gray-50  text-black pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-6 space-y-12">

          {/* ================= TITLE ================= */}
          <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-black tracking-tight">
                Library Catalog
              </h1>
              <p className="mt-2 text-gray-600 max-w-xl">
                Discover available books and borrow them instantly.
              </p>
            </div>

            {/* SEARCH */}
            <div className="w-full md:w-80">
              <input
                type="text"
                placeholder="Search by title or author…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none"
              />
            </div>
          </section>

          {/* ================= BOOK GRID ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => {
              const available = book.quantity > 0;

              return (
                <div
                  key={book._id}
                  className="group relative rounded-2xl bg-white border border-gray-200 shadow-sm p-6 flex flex-col justify-between transition hover:shadow-lg"
                >
                  {/* BOOK INFO */}
                  <div>
                    <h3 className="text-lg font-semibold text-black leading-snug group-hover:underline">
                      {book.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      by {book.author}
                    </p>

                    <p className="mt-4 text-xs text-gray-400 uppercase tracking-wide">
                      Copies Available
                    </p>
                    <p className="text-sm font-semibold text-black">
                      {book.quantity}
                    </p>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-6 flex items-center justify-between">
                    {/* STATUS */}
                    {available ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        <FaSquareCheck />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                        <PiKeyReturnBold />
                        Borrowed
                      </span>
                    )}

                    {/* ACTION */}
                    {available ? (
                      <button
                        onClick={() => handleBorrow(book)}
                        className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-900 active:scale-95"
                      >
                        Borrow
                      </button>
                    ) : (
                      <button
                        disabled
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-400 cursor-not-allowed"
                      >
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ================= EMPTY ================= */}
          {filteredBooks.length === 0 && (
            <div className="rounded-2xl bg-white border border-gray-200 p-14 text-center">
              <h3 className="text-lg font-semibold text-black">
                No Books Found
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Try a different title or author.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Catalog;
