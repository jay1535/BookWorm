import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

// 📌 Get all borrowed books by logged-in user
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
const {borrowedBooks} = req.user;
res.status(200).json({
  success: true,
  borrowedBooks
});
});


// 📌 Record borrowing a book
export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // bookId
  const { email } = req.body;

  const book = await Book.findById(id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book is out of stock", 400));
  }

  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false
  );
  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book is already borrowed", 400));
  }

  // update book
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  // update user
  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save();

  // create borrow record
  await Borrow.create({
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
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: book.price,
  });

  res.status(200).json({
    status: "success",
    message: "Borrowed Book recorded successfully",
    data: {
      book: {
        id: book._id,
        title: book.title,
        author: book.author,
        price: book.price,
      },
    },
  });
});

// 📌 Admin fetch borrowed book by borrowId
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find();
 res.status(200).json({
  success :true,
  borrowedBooks,
});
});

// 📌 Return a borrowed book
export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // bookId
  const { email } = req.body;

  const book = await Book.findById(id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false
  );
  if (!borrowedBook) {
    return next(new ErrorHandler("You have not borrowed this book.", 400));
  }

  borrowedBook.returned = true;
  await user.save();

  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrow = await Borrow.findOne({
    "book.id": id,
    "user.email": email,
    returnDate: null,
  });
  if (!borrow) return next(new ErrorHandler("Borrow record not found", 404));

  borrow.returnDate = new Date();
  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;
  await borrow.save();

  res.status(200).json({
    status: "success",
    message:
      fine !== 0
        ? `Book returned successfully. Total Charge is: ${fine + book.price}`
        : `Book returned successfully. The Total Charge is ${book.price}.`,
    data: { fine },
  });
});
