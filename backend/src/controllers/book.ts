import express from 'express';
import { Book } from '../models';
import bookValidator from '../util/validation';

const bookRouter = express.Router();

const mapBook = (book: Book, userId: string) => {
  const bookData = book.dataValues;
  const { userGoogleId, ...bookWithoutId } = bookData;
  if (userGoogleId === userId && !bookData.available) {
    return { ...bookWithoutId, borrowedByMe: true };
  } else {
    return { ...bookWithoutId, borrowedByMe: false };
  }
};

bookRouter.get('/', async (req, res) => {
  const userId = req.userId as string;
  const books = await Book.findAll();

  const mapBooks = (book: Book, id: string) => {
    const bookData = book.dataValues;
    const { userGoogleId, ...bookWithoutId } = bookData;
    if (userGoogleId === id && !bookData.available) {
      return { ...bookWithoutId, borrowedByMe: true };
    } else {
      return { ...bookWithoutId, borrowedByMe: false };
    }
  };
  const booksWithBorrowInfo = books.map((book) => mapBooks(book, userId));
  res.send(booksWithBorrowInfo);
});

bookRouter.post('/', bookValidator, async (req, res) => {
  const userId = req.userId as string;
  if (!req.admin) {
    res.status(401).send({ message: 'only admins can add books' });
    return;
  }

  const { title, authors, isbn, description, publishedDate, location } = req.body;
  const imageLink = req.body.imageLinks
    ? req.body.imageLinks[Object.keys(req.body.imageLinks).slice(-1)[0]]
    : undefined;

  try {
    const existingBook = await Book.findOne({ where: { isbn } });
    if (existingBook) {
      await Book.update(
        { title, authors, description, publishedDate, location, imageLink },
        { where: { isbn }, validate: true },
      );

      const updatedBook = await Book.findOne({ where: { isbn } });
      if (!updatedBook) {
        throw new Error('book not found');
      }
      res.status(200).send(mapBook(updatedBook, userId));
    } else {
      const newBook = await Book.create(
        {
          title,
          authors,
          isbn,
          description,
          publishedDate,
          location,
          lastBorrowedDate: new Date(),
          available: true,
          userGoogleId: userId,
          imageLink,
        },
        { validate: true },
      );
      res.status(201).send(mapBook(newBook, userId));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});

bookRouter.put('/borrow/:id', async (req, res) => {
  const userId = req.userId as string;
  if (!req.admin) {
    res.status(401).send({ message: 'only admins can add books' });
    return;
  }

  const bookId = req.params.id;
  const book = await Book.findOne({ where: { id: bookId } });

  if (book) {
    if (book.available) {
      const timeNow = new Date();
      book.lastBorrowedDate = timeNow;
      book.available = false;
      book.userGoogleId = userId;

      await book.save();

      res.json(mapBook(book, userId));
    } else {
      res.status(403).send({ message: 'book is not available' });
    }
  } else {
    res.status(404).send({ message: 'book does not exist' });
  }
});

bookRouter.put('/return/:id', async (req, res) => {
  const userId = req.userId as string;
  if (!req.admin) {
    res.status(401).send({ message: 'only admins can add books' });
    return;
  }

  const bookId = req.params.id;
  const book = await Book.findOne({ where: { id: bookId } });

  if (book) {
    if (userId === book.userGoogleId) {
      book.available = true;

      await book.save();

      res.json(mapBook(book, userId));
    } else {
      res.status(403).send({ message: 'no permission to return this book' });
    }
  } else {
    res.status(404).send({ message: 'book does not exist' });
  }
});

bookRouter.get('/:id', async (req, res) => {
  console.log(req.params.id);
  res.json('details');
});

export default bookRouter;
