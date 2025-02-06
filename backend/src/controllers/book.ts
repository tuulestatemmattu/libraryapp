import express from 'express';
import Book from '../models/book';
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
      const newBook = await Book.create(
        {
          title,
          authors,
          isbn,
          description,
          publishedDate,
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

export default bookRouter;
