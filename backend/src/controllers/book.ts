import express from 'express';
import Book from '../models/book';

const bookRouter = express.Router();
import isIsbn from 'validator/lib/isISBN';

bookRouter.post('/', async (req, res) => {
  const { title, authors, isbn, description, publishedDate } = req.body;

  try {

    if (!isIsbn(isbn)) {
    res.status(400).send({ message: 'Invalid ISBN' });
    return
    }

    if (!/^(19|20)\d{2}$/.test(publishedDate)) {
      res.status(400).send({ message: 'Invalid year' });
      return;
    }

    const existingBook = await Book.findOne({ where: { isbn } });

    if (existingBook) {
      await Book.update(
        { title, authors, description, publishedDate },
        { where: { isbn }, validate: true }
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
        { validate: true }
      );
      res.status(201).send(newBook);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message});
    }
  }
});

export default bookRouter;