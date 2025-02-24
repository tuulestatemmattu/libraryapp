import express from 'express';
import { Book, Borrow } from '../models';
import bookValidator from '../util/validation';

const bookRouter = express.Router();

const toBookWithBorrowedByMe = async (book: Book, userId: string) => {
  const bookData = book.dataValues;
  const myBorrow = await Borrow.findOne({ where: { bookId: book.id, userGoogleId: userId } });

  if (myBorrow) {
    return { ...bookData, borrowedByMe: true };
  } else {
    return { ...bookData, borrowedByMe: false };
  }
};

bookRouter.get('/', async (req, res) => {
  if (!req.UserId) {
    res.status(401).send({ message: 'must be logged in to get books' });
    return;
  }

  const books = await Book.findAll();
  const userId = req.UserId.toString();
  const booksWithBorrowInfo = await Promise.all(
    books.map((book) => toBookWithBorrowedByMe(book, userId)),
  );
  res.send(booksWithBorrowInfo);
});

bookRouter.post('/', bookValidator, async (req, res) => {
  const { title, authors, isbn, description, publishedDate, location } = req.body;

  console.log(Object.keys(req.body.imageLinks));

  const imageLink = req.body.imageLinks
    ? req.body.imageLinks[Object.keys(req.body.imageLinks).slice(-1)[0]]
    : undefined;

  try {
    const existingBook = await Book.findOne({ where: { isbn } });

    if (!req.UserId) {
      res.status(401).send({ message: 'must be logged in to add books' });
      return;
    }

    if (existingBook) {
      await existingBook.increment(['copies', 'copiesAvailable']);
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
            location,
            copies: 1,
            copiesAvailable: 1,
            imageLink,
          },
          { validate: true },
        );
        const newBookWithBorrowInfo = await toBookWithBorrowedByMe(newBook, req.UserId.toString());
        res.status(201).send(newBookWithBorrowInfo);
      } else {
        res.status(401).send({ message: 'must be logged in to add books' });
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
      if (book.copiesAvailable > 0) {
        book.decrement('copiesAvailable');
        const timeNow = new Date();
        const borrowedDate = timeNow;
        await Borrow.create({ bookId: book.id, userGoogleId: req.UserId.toString(), borrowedDate });
        await book.save();
        const borrowedBook = await toBookWithBorrowedByMe(book, req.UserId.toString());
        res.json(borrowedBook);
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
      const borrowed = await Borrow.findOne({
        where: { bookId: book.id, userGoogleId: req.UserId.toString() },
      });
      if (borrowed) {
        book.increment('copiesAvailable');
        await borrowed.destroy();
        await book.save();
        const returnedBook = await toBookWithBorrowedByMe(book, req.UserId.toString());
        res.json(returnedBook);
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

export default bookRouter;
