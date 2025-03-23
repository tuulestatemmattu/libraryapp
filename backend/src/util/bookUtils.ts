import { InferAttributes, WhereOptions } from 'sequelize/types/model';

import { Book, Borrow, QueueEntry, Tag } from '../models';

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
        required: false,
      },
      {
        model: QueueEntry,
        required: false,
      },
    ],
  });
  return books;
};

export const fetchBook = async (id: string | number) => {
  return (await fetchBooks({ id }))[0];
};

const calculateDueDate = (borrowedDate: Date) => {
  return new Date(borrowedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
};

export const calculateWaitingTime = (book: Book, queueEntry: QueueEntry) => {
  const activeBorrows = book.borrows;
  const queueEntries = book.queue_entries;
  if (activeBorrows === undefined || queueEntries === undefined) {
    throw new Error('Book does not have borrows or queue_entries');
  }
  activeBorrows.sort((a, b) => a.borrowedDate.getTime() - b.borrowedDate.getTime());
  queueEntries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

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

export const prepareBookForFrontend = (book: Book, userId: string) => {
  const myBorrow = book.borrows?.find((borrow) => borrow.userGoogleId === userId) || null;
  const myQueueEntry =
    book.queue_entries?.find((queueEntry) => queueEntry.userGoogleId === userId) || null;

  const dueDate = myBorrow ? calculateDueDate(myBorrow.borrowedDate) : null;
  const queueTime = myQueueEntry ? calculateWaitingTime(book, myQueueEntry) : null;
  const queueSize = book.queue_entries ? book.queue_entries.length : 0;

  let status = '';
  if (myBorrow) {
    if (new Date().getTime() > (dueDate as Date).getTime()) {
      status = 'late';
    } else {
      status = 'borrowed';
    }
  } else if (myQueueEntry) {
    if (queueTime === 0) {
      status = 'ready';
    } else {
      status = 'reserved';
    }
  } else {
    status = book.copiesAvailable - queueSize > 0 ? 'available' : 'unavailable';
  }

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
    borrowedByMe: !!myBorrow,
    dueDate: dueDate,
    queuedByMe: !!myQueueEntry,
    queueTime: queueTime,
    queueSize: queueSize,
    status: status,
  };
};
