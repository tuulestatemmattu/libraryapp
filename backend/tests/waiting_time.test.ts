/* eslint-disable no-undef */
import { calculateWaitingTime, fetchBook } from '../src/controllers/book';
import { Book, Borrow, ConnectionBookTag, QueueEntry, Tag } from '../src/models';
import { connectToDatabase, disconnectDatabase } from '../src/util/db';
import { initUsersWithSampleUser } from './common';

const sampleBook = {
  title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
  authors: 'Robert C. Martin',
  isbn: '9780132350884',
  description: 'A handbook of agile software craftsmanship.',
  publishedDate: '2009',
  location: 'Helsinki',
  copies: 1,
  copiesAvailable: 1,
};

beforeAll(async () => {
  await connectToDatabase();
  await initUsersWithSampleUser();

  await Book.sync();
  await Borrow.sync();
  await Tag.sync();
  await ConnectionBookTag.sync();
  await QueueEntry.sync();

  jest.useFakeTimers({ now: new Date(2025, 3, 30) }); //30.3.2025
});

afterAll(async () => {
  jest.useRealTimers();
  await disconnectDatabase();
});

describe('calculateWaitingTime function', () => {
  beforeEach(async () => {
    await Book.destroy({ where: {} });
    await Borrow.destroy({ where: {} });
    await QueueEntry.destroy({ where: {} });
  });

  it('should return 0 when one book available', async () => {
    const bookId = (await Book.create(sampleBook)).id;
    const entry = await QueueEntry.create({
      bookId,
      userGoogleId: 'sample_google_id',
    });

    const book = await fetchBook(bookId);
    const waitingTime = await calculateWaitingTime(book, entry);
    expect(waitingTime).toBe(0);
  });

  it('should return 0 when two books available', async () => {
    const bookId = (
      await Book.create({
        ...sampleBook,
        copies: 2,
        copiesAvailable: 2,
      })
    ).id;
    await QueueEntry.create({ bookId, userGoogleId: 'sample_google_id' });

    const entry = await QueueEntry.create({
      bookId,
      userGoogleId: 'sample_google_id',
    });
    const book = await fetchBook(bookId);
    const waitingTime = await calculateWaitingTime(book, entry);
    expect(waitingTime).toBe(0);
  });

  it('should return correct waiting time when only one user in queue and one copy', async () => {
    const bookId = (
      await Book.create({
        ...sampleBook,
        copies: 1,
        copiesAvailable: 0,
      })
    ).id;
    await Borrow.create({
      bookId,
      borrowedDate: new Date(2025, 3, 10), //10.3.2025
      userGoogleId: 'sample_google_id',
      active: true,
    });

    const entry = await QueueEntry.create({
      bookId,
      userGoogleId: 'sample_google_id',
    });
    const book = await fetchBook(bookId);
    const waitingTime = await calculateWaitingTime(book, entry);
    expect(waitingTime).toBe(11);
  });

  it('should return correct waiting time when only one user in queue and two copies', async () => {
    const bookId = (
      await Book.create({
        ...sampleBook,
        copies: 2,
        copiesAvailable: 0,
      })
    ).id;
    await Borrow.create({
      bookId,
      borrowedDate: new Date(2025, 3, 10), //10.3.2025
      userGoogleId: 'sample_google_id',
      active: true,
    });
    await Borrow.create({
      bookId,
      borrowedDate: new Date(2025, 3, 20), //20.3.2025
      userGoogleId: 'sample_google_id',
      active: true,
    });

    const entry = await QueueEntry.create({
      bookId,
      userGoogleId: 'sample_google_id',
    });
    const book = await fetchBook(bookId);
    const waitingTime = await calculateWaitingTime(book, entry);
    expect(waitingTime).toBe(11);
  });

  it('should return correct waiting time when two users in queue and two copies', async () => {
    const bookId = (
      await Book.create({
        ...sampleBook,
        copies: 2,
        copiesAvailable: 0,
      })
    ).id;
    await Borrow.create({
      bookId,
      borrowedDate: new Date(2025, 3, 10), //10.3.2025
      userGoogleId: 'sample_google_id',
      active: true,
    });
    await Borrow.create({
      bookId,
      borrowedDate: new Date(2025, 3, 20), //20.3.2025
      userGoogleId: 'sample_google_id',
      active: true,
    });

    const entry = await QueueEntry.create({
      bookId,
      userGoogleId: 'sample_google_id',
    });
    const entry2 = await QueueEntry.create({
      bookId,
      userGoogleId: 'sample_google_id',
    });

    const book = await fetchBook(bookId);
    const waitingTime = await calculateWaitingTime(book, entry);
    expect(waitingTime).toBe(11);
    const waitingTime2 = await calculateWaitingTime(book, entry2);
    expect(waitingTime2).toBe(21);
  });

  it('should return correct waiting time when two users in queue and one copy', async () => {
    const bookId = (
      await Book.create({
        ...sampleBook,
        copies: 1,
        copiesAvailable: 0,
      })
    ).id;
    await Borrow.create({
      bookId,
      borrowedDate: new Date(2025, 3, 10), //10.3.2025
      userGoogleId: 'sample_google_id',
      active: true,
    });

    const entry = await QueueEntry.create({
      bookId,
      userGoogleId: 'sample_google_id',
    });
    const entry2 = await QueueEntry.create({
      bookId,
      userGoogleId: 'sample_google_id',
    });

    const book = await fetchBook(bookId);
    const waitingTime = await calculateWaitingTime(book, entry);
    expect(waitingTime).toBe(11);
    const waitingTime2 = await calculateWaitingTime(book, entry2);
    expect(waitingTime2).toBe(42);
  });
});
