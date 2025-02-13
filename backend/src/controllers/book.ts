import express from 'express';
import { Book } from '../models';
import bookValidator from '../util/validation';

const bookRouter = express.Router();

bookRouter.get('/', async (_req, res) => {
  const books = await Book.findAll();
  res.send(books);
});

bookRouter.post('/', bookValidator, async (req, res) => {
  console.log('User ID', req.UserId);
  const { title, authors, isbn, description, publishedDate } = req.body;

  try {
    const existingBook = await Book.findOne({ where: { isbn } });

    if (existingBook) {
      await Book.update(
        { title, authors, description, publishedDate },
        { where: { isbn }, validate: true },
      );
      const updatedBook = await Book.findOne({ where: { isbn } });
      res.status(200).send(updatedBook);
    } else {
      if (req.UserId) {
        const newBook = await Book.create(
          {
            title,
            authors,
            isbn,
            description,
            publishedDate,
            lastBorrowedDate: null,
            available: true,
            userGoogleId: req.UserId.toString(),
          },
          { validate: true },
        );
        res.status(201).send(newBook);
      } else {
        res.status(403).send({ message: 'must be logged in to add books' });
      }
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
    res.status(403).send({ message: 'must be logged in to borrow books' });
  }
});

export default bookRouter;
