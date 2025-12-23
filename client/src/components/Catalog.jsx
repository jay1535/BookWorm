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

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  /* ================= CLEAR ERROR ================= */
  useEffect(() => {
    if (error) dispatch(clearBookError());
  }, [error, dispatch]);

  /* ================= SEARCH ================= */
  const filteredBooks = useMemo(() => {
    const key = search.toLowerCase();
    return books?.filter(
      (b) =>
        b.title?.toLowerCase().includes(key) ||
        b.author?.toLowerCase().includes(key)
    );
  }, [books, search]);

  /* ================= BORROW LOOKUP =================
     For each book, find:
     - activeBorrow (no returnDate)
     - lastReturned (most recent returned record)
  ================================================== */
  const borrowLookup = useMemo(() => {
    const map = {};

    allBorrowedBooks?.forEach((borrow) => {
      const bookId = borrow.book.id;

      if (!map[bookId]) {
        map[bookId] = {
          activeBorrow: null,
          lastReturned: null,
        };
      }

      if (!borrow.returnDate) {
        map[bookId].activeBorrow = borrow;
      } else {
        if (
          !map[bookId].lastReturned ||
          new Date(borrow.returnDate) >
            new Date(map[bookId].lastReturned.returnDate)
        ) {
          map[bookId].lastReturned = borrow;
        }
      }
    });

    return map;
  }, [allBorrowedBooks]);

  /* ================= BORROW ================= */
  const handleBorrow = (book) => {
    setSelectedBook(book);
    dispatch(toggleRecordBookPopup());
  };

  /* ================= RETURN ================= */
  const handleReturnPopup = (borrow) => {
    setSelectedBorrow(borrow);
    dispatch(toggleReturnBookPopup());
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

      {/* ================= POPUPS ================= */}
      {recordBookPopup && selectedBook && (
        <RecordBookPopup book={selectedBook} />
      )}

      {returnBookPopup && selectedBorrow && (
        <ReturnBookPopup borrow={selectedBorrow} />
      )}

      <main className="min-h-screen bg-gray-50 text-black pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-6 space-y-12">

          {/* ================= TITLE ================= */}
          <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Library Catalog
              </h1>
              <p className="mt-2 text-gray-600 max-w-xl">
                Borrow, return, and track book history.
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
              const record = borrowLookup[book._id] || {};
              const activeBorrow = record.activeBorrow;
              const lastReturned = record.lastReturned;

              return (
                <div
                  key={book._id}
                  className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 flex flex-col justify-between transition hover:shadow-lg"
                >
                  {/* BOOK INFO */}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      by {book.author}
                    </p>

                    {/* ACTIVE BORROW */}
                    {activeBorrow && (
                      <div className="mt-4 text-sm space-y-1 text-gray-600">
                        <p>
                          <span className="font-semibold">
                            Borrowed by:
                          </span>{" "}
                          {activeBorrow.user.email}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Due date:
                          </span>{" "}
                          {new Date(activeBorrow.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* RETURNED INFO */}
                    {!activeBorrow && lastReturned && (
                      <div className="mt-4 text-sm space-y-1 text-gray-600">
                        <p>
                          <span className="font-semibold">
                            Last returned on:
                          </span>{" "}
                          {new Date(
                            lastReturned.returnDate
                          ).toLocaleDateString()}
                        </p>
                        <p className="italic text-gray-500">
                          Previously borrowed by{" "}
                          {lastReturned.user.email}
                        </p>
                      </div>
                    )}

                    {/* AVAILABLE */}
                    {!activeBorrow && !lastReturned && (
                      <>
                        <p className="mt-4 text-xs text-gray-400 uppercase">
                          Copies Available
                        </p>
                        <p className="text-sm font-semibold">
                          {book.quantity}
                        </p>
                      </>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="mt-6 flex items-center justify-between">
                    {/* STATUS BADGE */}
                    {activeBorrow ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        <PiKeyReturnBold />
                        Borrowed
                      </span>
                    ) : lastReturned ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        <FaSquareCheck />
                        Returned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        <FaSquareCheck />
                        Available
                      </span>
                    )}

                    {/* ACTION */}
                    {activeBorrow ? (
                      <button
                        onClick={() => handleReturnPopup(activeBorrow)}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                      >
                        Return
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBorrow(book)}
                        className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-900"
                      >
                        Borrow
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>
    </>
  );
};

export default Catalog;
