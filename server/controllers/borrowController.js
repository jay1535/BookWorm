import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

/* =====================================================
   USER: GET ALL BORROWED BOOKS (FROM Borrow COLLECTION)
===================================================== */
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find({
    "user.id": req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

/* =====================================================
   USER: RECORD BORROWING A BOOK
===================================================== */
export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // bookId
  const { email } = req.body;

  const book = await Book.findById(id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book is out of stock", 400));
  }

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("User not found", 404));

  // Check if already borrowed
  const alreadyBorrowed = await Borrow.findOne({
    "user.id": user._id,
    "book.id": book._id,
    returnDate: null,
  });

  if (alreadyBorrowed) {
    return next(new ErrorHandler("Book is already borrowed", 400));
  }

  /* ===== UPDATE BOOK ===== */
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  /* ===== CREATE BORROW RECORD ===== */
  const borrow = await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: {
      id: book._id,
      title: book.title,
    },
    borrowDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    price: book.price,
    fine: 0,
    notified: false,
  });

  res.status(200).json({
    success: true,
    message: "Book borrowed successfully",
    borrowedBook: borrow,
  });
});

/* =====================================================
   ADMIN: FETCH ALL BORROWED BOOKS
===================================================== */
export const getBorrowedBooksForAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const borrowedBooks = await Borrow.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      borrowedBooks,
    });
  }
);

/* =====================================================
   USER: RETURN BORROWED BOOK
===================================================== */
export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // borrowId

  const borrow = await Borrow.findById(id);
  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found", 404));
  }

  if (borrow.returnDate) {
    return next(new ErrorHandler("Book already returned", 400));
  }

  /* ===== UPDATE BOOK ===== */
  const book = await Book.findById(borrow.book.id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  book.quantity += 1;
  book.availability = true;
  await book.save();

  /* ===== CALCULATE FINE ===== */
  const fine = calculateFine(borrow.dueDate);

  borrow.returnDate = new Date();
  borrow.fine = fine;
  await borrow.save();

  res.status(200).json({
    success: true,
    message:
      fine > 0
        ? `Book returned successfully. Fine: ₹${fine}`
        : "Book returned successfully.",
    fine,
  });
});
