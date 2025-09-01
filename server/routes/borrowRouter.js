import express from "express";
import {
  borrowedBooks,
  recordBorrowedBook,
  getBorrowedBooksForAdmin,
  returnBorrowedBook,
} from "../controllers/borrowController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User borrows a book
router.post("/record-borrowed-book/:id", isAuthenticated, recordBorrowedBook);

// Admin fetch borrow record by ID
router.get("/borrowed-books/:id", isAuthenticated, isAuthorized("Admin"), getBorrowedBooksForAdmin);

// User gets all borrowed books
router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);

// User returns a borrowed book
router.put("/return-borrowed-book/:id", isAuthenticated, returnBorrowedBook);

export default router;
