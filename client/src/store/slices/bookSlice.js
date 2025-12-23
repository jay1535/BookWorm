import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
  },

  reducers: {
    /* ================= FETCH BOOKS ================= */
    fetchBookRequest(state) {
      state.loading = true;
      state.error = null;
    },

    fetchBookSuccess(state, action) {
      state.loading = false;
      state.books = action.payload;
      state.error = null;
    },

    fetchBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    /* ================= ADD BOOK ================= */
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
    },

    addBookSuccess(state, action) {
      state.loading = false;
      state.books.unshift(action.payload);
      state.message = "Book added successfully";
      state.error = null;
    },

    addBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    /* ================= DELETE BOOK ================= */
    deleteBookRequest(state) {
      state.loading = true;
      state.error = null;
    },

    deleteBookSuccess(state, action) {
      state.loading = false;
      state.books = state.books.filter(
        (book) => book._id !== action.payload
      );
      state.message = "Book deleted successfully";
    },

    deleteBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    /* ================= CLEAR ================= */
    clearBookError(state) {
      state.error = null;
    },

    clearBookMessage(state) {
      state.message = null;
    },
  },
});

export const {
  fetchBookRequest,
  fetchBookSuccess,
  fetchBookFailed,
  addBookRequest,
  addBookSuccess,
  addBookFailed,
  deleteBookRequest,
  deleteBookSuccess,
  deleteBookFailed,
  clearBookError,
  clearBookMessage,
} = bookSlice.actions;

export default bookSlice.reducer;

/* =====================================================
   ASYNC ACTIONS (THUNKS)
===================================================== */

/* ================= FETCH ALL BOOKS ================= */
export const fetchAllBooks = () => async (dispatch) => {
  try {
    dispatch(fetchBookRequest());

    const { data } = await axios.get("/api/v1/book/all", {
      withCredentials: true,
    });

    dispatch(fetchBookSuccess(data.books));
  } catch (error) {
    dispatch(
      fetchBookFailed(
        error.response?.data?.message || "Failed to fetch books"
      )
    );
  }
};

/* ================= ADD BOOK ================= */
export const addBook = (bookData) => async (dispatch) => {
  try {
    dispatch(addBookRequest());

    const { data } = await axios.post(
      "/api/v1/book/admin/add",
      bookData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    dispatch(addBookSuccess(data.book));
    dispatch(fetchAllBooks())
    toast.success("Book added Successfully")

  } catch (error) {
    dispatch(
      addBookFailed(
        error.response?.data?.message || "Failed to add book"
      )
    );
  }
};

/* ================= DELETE BOOK ================= */
export const deleteBook = (id) => async (dispatch) => {
  try {
    dispatch(deleteBookRequest());

    await axios.delete(`/api/v1/book/delete/${id}`, {
      withCredentials: true,
    });

    dispatch(deleteBookSuccess(id));
    dispatch(fetchAllBooks())
    toast.success("Book deleted Successfully")
  } catch (error) {
    dispatch(
      deleteBookFailed(
        error.response?.data?.message || "Failed to delete book"
      )
    );
    toast.error("Failed to dellete the book")
  }
};
