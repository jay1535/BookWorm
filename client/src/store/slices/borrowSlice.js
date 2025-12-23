import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchAllBooks } from "./bookSlice";

/* =====================================================
   INITIAL STATE
===================================================== */
const initialState = {
  loading: false,
  error: null,
  message: null,

  // User-specific borrowed books
  userBorrowedBooks: [],

  // Admin view (all users)
  allBorrowedBooks: [],
};

/* =====================================================
   SLICE
===================================================== */
const borrowSlice = createSlice({
  name: "borrow",
  initialState,

  reducers: {
    /* ================= RESET ================= */
    resetBorrowSlice() {
      return initialState;
    },

    /* =====================================================
       USER: FETCH BORROWED BOOKS
    ===================================================== */
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
    },

    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
    },

    fetchUserBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    /* =====================================================
       USER: RECORD BORROW
    ===================================================== */
    recordBorrowBookRequest(state) {
      state.loading = true;
      state.error = null;
    },

    recordBorrowBookSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks.unshift(action.payload);
      state.message = "Book borrowed successfully";
    },

    recordBorrowBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    /* =====================================================
       USER: RETURN BORROWED BOOK
       (Keeps record & updates returnDate)
    ===================================================== */
    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
    },

    returnBookSuccess(state, action) {
      state.loading = false;

      state.userBorrowedBooks = state.userBorrowedBooks.map((borrow) =>
        borrow._id === action.payload
          ? {
              ...borrow,
              returnDate: new Date().toISOString(),
            }
          : borrow
      );

      state.message = "Book returned successfully";
    },

    returnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    /* =====================================================
       ADMIN: FETCH ALL BORROWED BOOKS
    ===================================================== */
    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
    },

    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
    },

    fetchAllBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    /* =====================================================
       CLEAR
    ===================================================== */
    clearBorrowError(state) {
      state.error = null;
    },

    clearBorrowMessage(state) {
      state.message = null;
    },
  },
});

/* =====================================================
   EXPORT ACTIONS & REDUCER
===================================================== */
export const {
  resetBorrowSlice,

  fetchUserBorrowedBooksRequest,
  fetchUserBorrowedBooksSuccess,
  fetchUserBorrowedBooksFailed,

  recordBorrowBookRequest,
  recordBorrowBookSuccess,
  recordBorrowBookFailed,

  returnBookRequest,
  returnBookSuccess,
  returnBookFailed,

  fetchAllBorrowedBooksRequest,
  fetchAllBorrowedBooksSuccess,
  fetchAllBorrowedBooksFailed,

  clearBorrowError,
  clearBorrowMessage,
} = borrowSlice.actions;

export default borrowSlice.reducer;

/* =====================================================
   ASYNC ACTIONS (THUNKS)
===================================================== */

/* ================= USER: FETCH MY BORROWED BOOKS ================= */
export const fetchUserBorrowedBooks = () => async (dispatch) => {
  try {
    dispatch(fetchUserBorrowedBooksRequest());

    const { data } = await axios.get(
      "/api/v1/borrow/my-borrowed-books",
      { withCredentials: true }
    );

    dispatch(fetchUserBorrowedBooksSuccess(data.borrowedBooks));
  } catch (error) {
    dispatch(
      fetchUserBorrowedBooksFailed(
        error.response?.data?.message ||
          "Failed to fetch borrowed books"
      )
    );
  }
};

/* ================= USER: RECORD BORROW BOOK ================= */
export const recordBorrowBook =
  ({ bookId, email }) =>
  async (dispatch) => {
    try {
      dispatch(recordBorrowBookRequest());

      const { data } = await axios.post(
        `/api/v1/borrow/record-borrowed-book/${bookId}`,
        { email }, // ✅ SEND EMAIL
        { withCredentials: true }
      );

      dispatch(recordBorrowBookSuccess(data.borrowedBook));
      toast.success("Book Borrowed Successfully")
      dispatch(fetchAllBooks())
    } catch (error) {
      dispatch(
        recordBorrowBookFailed(
          error.response?.data?.message || "Failed to borrow book"
        )
      );
    }
  };


/* ================= USER: RETURN BORROWED BOOK ================= */
export const returnBook = (borrowId) => async (dispatch) => {
  try {
    dispatch(returnBookRequest());

    await axios.put(
      `/api/v1/borrow/return-borrowed-book/${borrowId}`,
      {},
      { withCredentials: true }
    );

    dispatch(returnBookSuccess(borrowId));
    toast.success("Book returned Successfully")
    dispatch(fetchAllBooks())
  } catch (error) {
    dispatch(
      returnBookFailed(
        error.response?.data?.message ||
          "Failed to return book"
      )
    );
  }
};

/* ================= ADMIN: FETCH ALL BORROWED BOOKS ================= */
export const fetchAllBorrowedBooks = () => async (dispatch) => {
  try {
    dispatch(fetchAllBorrowedBooksRequest());

    const { data } = await axios.get(
      "/api/v1/borrow/borrowed-books-by-users",
      { withCredentials: true }
    );

    dispatch(fetchAllBorrowedBooksSuccess(data.borrowedBooks));
    dispatch(fetchAllBooks())
    
  } catch (error) {
    dispatch(
      fetchAllBorrowedBooksFailed(
        error.response?.data?.message ||
          "Failed to fetch borrowed books"
      )
    );
  }
};
