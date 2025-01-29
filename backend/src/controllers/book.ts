import express from 'express';
import Book from '../models/book';

const bookRouter = express.Router();

bookRouter.post('/', async (req, res) => { // 'No overload matches this call' error
  // TODO: handle errors and edge cases
  const { title, authors, isbn, description, publishedDate } = req.body;

  // TODO: check the fields below to confirm they comply with Google Books API and the Book model
  try {
    const existingBook = await Book.findOne({ where: { isbn } });

    if (existingBook) {
      await Book.update(
        { title, authors, description, publishedDate },
        { where: { isbn } }
      );
      const updatedBook = await Book.findOne({ where: { isbn } });
      return res.status(200).send(updatedBook);
    } else {
      const newBook = await Book.create({
        title,
        authors,
        isbn,
        description,
        publishedDate,
      });
      return res.status(201).send(newBook);
    }
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

export default bookRouter;