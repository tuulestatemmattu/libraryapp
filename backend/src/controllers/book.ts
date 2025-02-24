import express from 'express';
import { Book } from '../models';
import bookValidator from '../util/validation';

const bookRouter = express.Router();

bookRouter.get('/', async (req, res) => {
  if (!req.UserId) {
    res.status(401).send({ message: 'must be logged in to get books' });
    return;
  }

  const books = await Book.findAll();
  const userId = req.UserId.toString();

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
  const { title, authors, isbn, description, publishedDate, location } = req.body;

  const imageLink = req.body.imageLinks
    ? req.body.imageLinks[Object.keys(req.body.imageLinks)[0]]
    : undefined;

  try {
    const existingBook = await Book.findOne({ where: { isbn } });

    if (!req.UserId) {
      res.status(401).send({ message: 'must be logged in to add books' });
      return;
    }

    if (existingBook) {
      await Book.update(
        { title, authors, description, publishedDate, location, imageLink },
        { where: { isbn }, validate: true },
      );
      const updatedBook = await Book.findOne({ where: { isbn } });
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
          lastBorrowedDate: null,
          available: true,
          userGoogleId: req.UserId.toString(),
          imageLink,
        },
        { validate: true },
      );
      res.status(201).send(newBook);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});

bookRouter.put('/borrow/:id', async (req, res) => {
  const bookId = req.params.id;

  const book = await Book.findOne({ where: { id: bookId } });
  if (req.UserId) {
    if (book) {
      if (book.available) {
        const timeNow = new Date();
        book.lastBorrowedDate = timeNow;
        book.available = false;
        book.userGoogleId = req.UserId.toString();

        await book.save();

        res.json(book);
      } else {
        res.status(403).send({ message: 'book is not available' });
      }
    } else {
      res.status(404).send({ message: 'book does not exist' });
    }
  } else {
    res.status(401).send({ message: 'must be logged in to borrow books' });
  }
});

bookRouter.put('/return/:id', async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findOne({ where: { id: bookId } });

  if (req.UserId) {
    if (book) {
      if (req.UserId.toString() === book.userGoogleId) {
        book.available = true;

        await book.save();

        res.json(book);
      } else {
        res.status(403).send({ message: 'no permission to return this book' });
      }
    } else {
      res.status(404).send({ message: 'book does not exist' });
    }
  } else {
    res.status(401).send({ message: 'must be logged in to return books' });
  }
});

bookRouter.get('/:id', async (req, res) => {
  console.log(req.params.id);
  res.json('details');
});

export default bookRouter;
