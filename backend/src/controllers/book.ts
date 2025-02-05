import express from 'express';
import Book from '../models/book';

const bookRouter = express.Router();

bookRouter.get('/', async (_req, res) => {
  const books = await Book.findAll();
  res.send(books);
});

bookRouter.post('/', async (req, res) => {
  console.log('User ID', req.UserId);
  // TODO: handle errors and edge cases
  const { title, authors, isbn, description, publishedDate } = req.body;

  try {
    const existingBook = await Book.findOne({ where: { isbn } });

    if (existingBook) {
      await Book.update({ title, authors, description, publishedDate }, { where: { isbn } });
      const updatedBook = await Book.findOne({ where: { isbn } });
      res.status(200).send(updatedBook);
    } else {
      const newBook = await Book.create({
        title,
        authors,
        isbn,
        description,
        publishedDate,
      });
      res.status(201).send(newBook);
    }
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

export default bookRouter;
