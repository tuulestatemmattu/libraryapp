import express from 'express';
import { Book, Borrow } from '../models';
import bookValidator from '../util/validation';
import { requireLogin } from '../util/middleware/requireLogin';
import { requireAdmin } from '../util/middleware/requireAdmin';

const bookRouter = express.Router();
bookRouter.use(requireLogin);

const toBookWithBorrowedByMe = async (book: Book, userId: string) => {
  const bookData = book.dataValues;
  const myBorrow = await Borrow.findOne({ where: { bookId: book.id, userGoogleId: userId } });

  if (myBorrow) {
    return { ...bookData, borrowedByMe: true, lastBorrowedDate: myBorrow.borrowedDate };
  } else {
    return { ...bookData, borrowedByMe: false };
  }
};

bookRouter.get('/', async (req, res) => {
  if (!req.userId) {
    res.status(401).send({ message: 'must be logged in to get books' });
    return;
  }

  const books = await Book.findAll();
  const userId = req.userId.toString();
  const booksWithBorrowInfo = await Promise.all(
    books.map((book) => toBookWithBorrowedByMe(book, userId)),
  );
  res.send(booksWithBorrowInfo);
});

bookRouter.post('/', bookValidator, requireAdmin, async (req, res) => {
  const userId = req.userId as string;
  const { title, authors, isbn, description, publishedDate, location } = req.body;

  const imageLink = req.body.imageLinks
    ? req.body.imageLinks[Object.keys(req.body.imageLinks).slice(-1)[0]]
    : undefined;

  try {
    const existingBook = await Book.findOne({ where: { isbn } });

    if (existingBook) {
      const updatedBook = await existingBook.increment(['copies', 'copiesAvailable']);
      res.status(200).send(updatedBook);
    } else {
      const newBook = await Book.create(
        {
          title,
          authors,
          isbn,
          description,
          publishedDate,
          location,
          copies: 1,
          copiesAvailable: 1,
          imageLink,
        },
        { validate: true },
      );
      const newBookWithBorrowInfo = await toBookWithBorrowedByMe(newBook, userId);
      res.status(201).send(newBookWithBorrowInfo);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});

bookRouter.put('/borrow/:id', async (req, res) => {
  const userId = req.userId as string;
  const bookId = req.params.id;
  const book = await Book.findOne({ where: { id: bookId } });

  if (book) {
    if (book.copiesAvailable > 0) {
      book.decrement('copiesAvailable');
      const timeNow = new Date();
      const borrowedDate = timeNow;
      await Borrow.create({ bookId: book.id, userGoogleId: userId, borrowedDate });
      await book.save();
      const borrowedBook = await toBookWithBorrowedByMe(book, userId);
      res.json(borrowedBook);
    } else {
      res.status(403).send({ message: 'book is not available' });
    }
  } else {
    res.status(404).send({ message: 'book does not exist' });
  }
});

bookRouter.put('/return/:id', async (req, res) => {
  const userId = req.userId as string;
  const bookId = req.params.id;
  const book = await Book.findOne({ where: { id: bookId } });

  if (book) {
    const borrowed = await Borrow.findOne({
      where: { bookId: book.id, userGoogleId: userId },
    });
    if (borrowed) {
      book.increment('copiesAvailable');
      await borrowed.destroy();
      await book.save();
      const returnedBook = await toBookWithBorrowedByMe(book, userId);
      res.json(returnedBook);
    } else {
      res.status(403).send({ message: 'no permission to return this book' });
    }
  } else {
    res.status(404).send({ message: 'book does not exist' });
  }
});

export default bookRouter;
