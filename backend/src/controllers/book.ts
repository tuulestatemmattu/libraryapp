import express from 'express';

import { Book, Borrow, QueueEntry, Tag, User } from '../models';
import {
  calculateDaysLeft,
  calculateDueDate,
  fetchBook,
  fetchBooks,
  prepareBookForFrontend,
} from '../util/bookUtils';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { requireLogin } from '../util/middleware/requireLogin';
import {
  SlackAttachment,
  SlackBlock,
  sendNotificationToChannel,
  sendPrivateMessage,
} from '../util/slackbot';
import bookValidator from '../util/validation';

const bookRouter = express.Router();
bookRouter.use(requireLogin);

bookRouter.get('/', async (req, res) => {
  const userId = req.userId as string;
  const books = await fetchBooks({});
  res.json(books.map((book) => prepareBookForFrontend(book, userId)));
});

bookRouter.post('/', requireAdmin, bookValidator, async (req, res) => {
  const userId = req.userId as string;
  const { title, authors, isbn, description, publishedDate, location, copies, tags } = req.body;

  const imageLink = req.body.imageLinks
    ? req.body.imageLinks[Object.keys(req.body.imageLinks).slice(-1)[0]]
    : undefined;

  try {
    if (await Book.findOne({ where: { isbn, location } })) {
      res.status(400).send('Book is already in the database');
      return;
    }

    const book = await Book.create(
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
    await book.setTags(tag_ids);

    const fetchedBook = (await fetchBook(book.id)) as Book;
    res.status(201).send(prepareBookForFrontend(fetchedBook, userId));

    const tagNames = fetchedBook.tags?.map((tag: Tag) => tag.name).join(', ');

    if (location === 'Helsinki') {
      const payload: {
        blocks: SlackBlock[];
        attachments: SlackAttachment[];
      } = {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `:books: *${title}* has been added to the library!`,
            },
          },
          {
            type: 'image',
            image_url: imageLink ?? '',
            alt_text: 'Book cover image',
            title: {
              type: 'plain_text',
              text: title,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `:paperclip: *Tags:* ${tagNames ?? 'No tags'}`,
              },
            ],
          },
        ],
        attachments: [
          {
            fallback: `Description: ${description}`,
            color: '#e0e0e0',
            text: `*Description:*\n${description}`,
          },
        ],
      };

      sendNotificationToChannel(payload).catch((err: unknown) => {
        console.error('Failed to send Slack notification:', err);
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});

bookRouter.put('/:id', requireAdmin, bookValidator, async (req, res) => {
  const bookId = req.params.id;
  const userId = req.userId as string;
  const { title, authors, isbn, description, publishedDate, location, copies, imageLink, tags } =
    req.body;

  const bookToEdit = await fetchBook(bookId);
  if (!bookToEdit) {
    res.status(404).send({ message: `Book with id ${bookId} does not exist` });
    return;
  }

  const copiesAvailable = bookToEdit.copiesAvailable + Number(copies) - bookToEdit.copies;
  if (Number(copies) < copiesAvailable) {
    res
      .status(400)
      .json({ message: "Copies can't be chanced, since there are too many borrowed." });
    return;
  }

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

  const editedBook = prepareBookForFrontend(bookToEdit, userId);
  res.status(201).send({ ...editedBook, tags });
});

bookRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    if (!book) {
      res.status(404).send({ message: 'Book not found' });
      return;
    }
    await book.destroy();
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});

bookRouter.post('/:id/borrow', async (req, res) => {
  const userId = req.userId as string;
  const bookId = req.params.id;

  const book = await fetchBook(bookId);
  if (book) {
    if (book.copiesAvailable > 0) {
      const timeNow = new Date();
      const borrowedDate = timeNow;
      await Borrow.create({ bookId: book.id, userGoogleId: userId, borrowedDate, active: true });
      await QueueEntry.destroy({ where: { bookId: book.id, userGoogleId: userId } });

      await book.decrement('copiesAvailable');
      await book.reload();
      const borrowedBook = prepareBookForFrontend(book, userId);
      res.json(borrowedBook);
    } else {
      res.status(403).send({ message: 'book is not available' });
    }
  } else {
    res.status(404).send({ message: 'book does not exist' });
  }
});

bookRouter.post('/:id/return', async (req, res) => {
  const userId = req.userId as string;
  const bookId = req.params.id;

  const book = await fetchBook(bookId);
  if (!book) {
    res.status(404).send({ message: 'book does not exist' });
    return;
  }

  const borrow = req.admin
    ? await Borrow.findOne({
        where: { bookId: book.id, active: true },
      })
    : await Borrow.findOne({
        where: { bookId: book.id, userGoogleId: userId, active: true },
      });

  if (!borrow) {
    res.status(403).send({ message: 'no permission to return this book' });
    return;
  }

  borrow.set({ ...borrow, active: false });
  await borrow.save();

  await book.increment('copiesAvailable');
  await book.save();
  await book.reload();

  if (book.queue_entries && book.queue_entries.length > 0) {
    const ready_count = book.copiesAvailable - 1;
    await book.queue_entries[Number(ready_count)].update({ readyDate: new Date() });

    const receiver_user = await User.findByPk(book.queue_entries[Number(ready_count)].userGoogleId);
    if (receiver_user) {
      sendPrivateMessage(
        receiver_user.email,
        `:book: Your reserved book "*${book.title}*" is now available for you to borrow!`,
      ).catch((error: unknown) => {
        console.error('Failed to send Slack notification:', error);
      });
    }
  }

  const returnedBook = prepareBookForFrontend(book, userId);
  res.json(returnedBook);
});

bookRouter.post('/:id/reserve', async (req, res) => {
  const userId = req.userId as string;
  const bookId = parseInt(req.params.id);

  if (await QueueEntry.findOne({ where: { bookId, userGoogleId: userId } })) {
    res.status(403).send({ message: 'Book is already reserved' });
    return;
  }

  await QueueEntry.create({
    bookId: bookId,
    userGoogleId: userId,
  });

  const book = (await fetchBook(bookId)) as Book;
  res.json(prepareBookForFrontend(book, userId));
});

bookRouter.post('/:id/unreserve', async (req, res) => {
  const userId = req.userId as string;
  const bookId = parseInt(req.params.id);

  const deleted = await QueueEntry.destroy({
    where: { bookId, userGoogleId: userId },
  });
  if (!deleted) {
    res.status(404).send({ message: 'Book is not reserved' });
    return;
  }

  const book = (await fetchBook(bookId)) as Book;
  res.json(prepareBookForFrontend(book, userId));
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

  const newBorrows = borrows.map((borrow: Borrow) => ({
    ...borrow.dataValues,
    dueDate: calculateDueDate(borrow.borrowedDate),
    daysLeft: calculateDaysLeft(borrow.borrowedDate),
  }));
  res.json(newBorrows);
});

bookRouter.put('/:id/extend', async (req, res) => {
  const id = req.params.id;
  const userId = req.userId as string;
  const loan = await Borrow.findOne({
    where: { bookId: id, userGoogleId: req.userId, active: true },
  });
  if (!loan) {
    res.status(404).send({ message: 'Loan not found' });
    return;
  }
  const reserved = await QueueEntry.findOne({
    where: { bookId: loan.bookId },
  });
  if (reserved) {
    res.status(403).send({ message: 'Loan cannot be extended, since there is a reservation' });
    return;
  }
  const newBorrowDate = new Date();
  const newLoan = await loan.update({ borrowedDate: newBorrowDate });

  await newLoan.save();
  const book = (await fetchBook(newLoan.bookId)) as Book;
  const newBook = prepareBookForFrontend(book, userId);
  res.json(newBook);
});

bookRouter.get('/queue', requireAdmin, async (req, res) => {
  const queueEntries = await QueueEntry.findAll({
    attributes: ['id', 'createdAt', 'bookId'],
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
    order: [
      ['bookId', 'ASC'],
      ['createdAt', 'ASC'],
    ],
  });

  const newQueueEntries = queueEntries.map(
    (entry: QueueEntry, index: number, array: QueueEntry[]) => {
      const position =
        array.filter((e) => e.bookId === entry.bookId).findIndex((e) => e.id === entry.id) + 1;

      return {
        ...entry.dataValues,
        position,
      };
    },
  );

  res.json(newQueueEntries);
});

bookRouter.delete('/queue/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const queueEntry = await QueueEntry.findByPk(id);
    if (!queueEntry) {
      res.status(404).send({ message: 'Queue entry not found' });
      return;
    }

    await queueEntry.destroy();
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});

export default bookRouter;
