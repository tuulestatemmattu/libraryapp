import express from 'express';
import { InferAttributes, WhereOptions } from 'sequelize';

import { Book, Borrow, QueueEntry, Tag, User } from '../models';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { requireLogin } from '../util/middleware/requireLogin';
import bookValidator from '../util/validation';

const bookRouter = express.Router();
bookRouter.use(requireLogin);

export const fetchBooks = async (where: WhereOptions<InferAttributes<Book>>) => {
  const books = await Book.findAll({
    where,
    include: [
      {
        model: Tag,
        attributes: ['name', 'id'],
        through: {
          attributes: [],
        },
      },
      {
        model: Borrow,
        where: { active: true },
        order: [['borrowedDate', 'ASC']],
        required: false,
      },
      {
        model: QueueEntry,
        order: [['createdAt', 'ASC']],
        required: false,
      },
    ],
  });
  return books;
};

export const fetchBook = async (id: string | number) => {
  return (await fetchBooks({ id }))[0];
};

export const calculateWaitingTime = async (book: Book, queueEntry: QueueEntry) => {
  const activeBorrows = book.borrows;
  const queueEntries = book.queue_entries;
  if (activeBorrows === undefined || queueEntries === undefined) {
    throw new Error('Book does not have borrows or queue_entries');
  }

  const waitingTimes: number[] = [];
  for (let i = 0; i < queueEntries.length; i++) {
    if (i < book.copiesAvailable) {
      waitingTimes.push(0);
    } else if (i < book.copies) {
      const diffMs = activeBorrows[i].borrowedDate.getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      waitingTimes.push(Math.max(0, diffDays + 30) + 1);
    } else {
      waitingTimes.push(waitingTimes[i % book.copies] + 30 + 1);
    }
  }

  const index = queueEntries.findIndex((entry) => entry.id === queueEntry.id);
  return waitingTimes[index];
};

const prepareBookForFrontend = async (book: Book, userId: string) => {
  const myBorrow =
    book.borrows === undefined
      ? null
      : book.borrows.find((borrow) => borrow.userGoogleId === userId) || null;
  const myQueue =
    book.queue_entries === undefined
      ? null
      : book.queue_entries.find((queue) => queue.userGoogleId === userId) || null;

  return {
    id: book.id,
    authors: book.authors,
    title: book.title,
    isbn: book.isbn,
    publishedDate: book.publishedDate,
    description: book.description,
    location: book.location,
    copies: book.copies,
    copiesAvailable: book.copiesAvailable,
    imageLink: book.imageLink,

    tags: book.tags,
    borrowedByMe: myBorrow ? true : false,
    lastBorrowedDate: myBorrow ? myBorrow.borrowedDate : null,
    queuedByMe: myQueue ? true : false,
    queueTime: myQueue ? await calculateWaitingTime(book, myQueue) : null,
  };
};

bookRouter.get('/', async (req, res) => {
  if (!req.userId) {
    res.status(401).send({ message: 'must be logged in to get books' });
    return;
  }

  const books = await fetchBooks({});
  const userId = req.userId.toString();
  const booksWithBorrowInfo = await Promise.all(
    books.map((book) => prepareBookForFrontend(book, userId)),
  );
  res.send(booksWithBorrowInfo);
});

bookRouter.post('/', bookValidator, requireAdmin, async (req, res) => {
  const userId = req.userId as string;
  const { title, authors, isbn, description, publishedDate, location, copies, tags } = req.body;

  const imageLink = req.body.imageLinks
    ? req.body.imageLinks[Object.keys(req.body.imageLinks).slice(-1)[0]]
    : undefined;

  try {
    const existingBook = await Book.findOne({ where: { isbn } });

    if (existingBook) {
      const updatedBook = await existingBook.increment(['copies', 'copiesAvailable'], {
        by: copies,
      });

      const tag_ids = tags.map((tag: Tag) => tag.id);
      await updatedBook.setTags(tag_ids);

      const updatedBookWithBorrowInfo = await prepareBookForFrontend(updatedBook, userId);
      res.status(200).send({ ...updatedBookWithBorrowInfo, tags });
    } else {
      const newBook = await Book.create(
        {
          title,
          authors,
          isbn,
          description,
          publishedDate,
          location,
          copies,
          copiesAvailable: copies,
          imageLink,
        },
        { validate: true },
      );

      const tag_ids = tags.map((tag: Tag) => tag.id);
      await newBook.setTags(tag_ids);

      const newBookWithBorrowInfo = await prepareBookForFrontend(newBook, userId);
      res.status(201).send({ ...newBookWithBorrowInfo, tags });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});

bookRouter.put('/edit/:id', bookValidator, requireAdmin, async (req, res) => {
  const bookId = req.params.id;
  const userId = req.userId as string;
  const { title, authors, isbn, description, publishedDate, location, copies, imageLink, tags } =
    req.body;

  const bookToEdit = await Book.findOne({ where: { id: bookId } });

  if (bookToEdit) {
    const copiesAvailable = bookToEdit.copiesAvailable + Number(copies) - bookToEdit.copies;

    if (Number(copies) < copiesAvailable) {
      res.status(400).json({ message: 'Copies cannot be less than Copies Available' });
      return;
    }

    if (copiesAvailable < 0) {
      res.status(400).json({ message: 'Copies available cannot be less than 0' });
    } else {
      bookToEdit.set({
        title: title,
        authors: authors,
        isbn: isbn,
        description: description,
        publishedDate: publishedDate,
        location: location,
        copies: copies,
        copiesAvailable: copiesAvailable,
        imageLink: imageLink,
      });

      const tag_ids = tags.map((tag: Tag) => tag.id);
      await bookToEdit.setTags(tag_ids);

      await bookToEdit.save();

      const editedBook = await prepareBookForFrontend(bookToEdit, userId);
      res.status(201).send({ ...editedBook, tags });
    }
  } else {
    res.status(404).send({ message: `Book with id ${bookId} does not exist` });
  }
});

bookRouter.put('/borrow/:id', async (req, res) => {
  const userId = req.userId as string;
  const bookId = req.params.id;

  const book = await fetchBook(bookId);
  if (book) {
    if (book.copiesAvailable > 0) {
      book.decrement('copiesAvailable');
      const timeNow = new Date();
      const borrowedDate = timeNow;
      await Borrow.create({ bookId: book.id, userGoogleId: userId, borrowedDate, active: true });
      await book.save();
      const borrowedBook = await prepareBookForFrontend(book, userId);
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

  const book = await fetchBook(bookId);
  if (book) {
    const borrowed = req.admin
      ? await Borrow.findOne({
          where: { bookId: book.id, active: true },
        })
      : await Borrow.findOne({
          where: { bookId: book.id, userGoogleId: userId, active: true },
        });
    if (borrowed) {
      book.increment('copiesAvailable');
      borrowed.set({ ...borrowed, active: false });
      await borrowed.save();
      await book.save();
      const returnedBook = await prepareBookForFrontend(book, userId);
      res.json(returnedBook);
    } else {
      res.status(403).send({ message: 'no permission to return this book' });
    }
  } else {
    res.status(404).send({ message: 'book does not exist' });
  }
});

bookRouter.get('/borrows', requireAdmin, async (req, res) => {
  const borrows = await Borrow.findAll({
    attributes: ['id', 'borrowedDate', 'active'],
    include: [
      {
        model: User,
        attributes: ['name', 'email'],
      },
      {
        model: Book,
        attributes: ['title', 'id'],
      },
    ],
  });
  res.json(borrows);
});

bookRouter.put('/queue/:id', async (req, res) => {
  const userId = req.userId as string;
  const bookId = parseInt(req.params.id);

  const queueEntry = await QueueEntry.findOne({
    where: { bookId, userGoogleId: userId },
  });
  if (queueEntry) {
    res.status(403).send({ message: 'Book is already in queue' });
    return;
  }

  await QueueEntry.create({
    bookId: bookId,
    userGoogleId: userId,
  });

  const book = await fetchBook(bookId);
  if (!book) {
    res.status(404).send({ message: 'Book not found... This shouldnt be possible.' });
    return;
  }
  res.json(await prepareBookForFrontend(book, userId));
});

export default bookRouter;
