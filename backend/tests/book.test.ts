/* eslint-disable no-undef */
import supertest from 'supertest';
import { Book, Borrow, ConnectionBookTag, QueueEntry, Tag } from '../src/models';
import { connectToDatabase, disconnectDatabase } from '../src/util/db';
import { initUsersWithSampleUser, mockTokenExtractor } from './common';

mockTokenExtractor('sample_google_id', true);

import app from '../src/app';
const api = supertest(app);

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

const sampleBook2 = {
  title: "Harry Potter and the Sorcerer's Stone",
  authors: 'J. K. Rowling',
  isbn: '9780590353427',
  description: 'The book that started the magic.',
  publishedDate: '1998',
  location: 'Helsinki',
  copies: 1,
  copiesAvailable: 1,
};

const sampleTag = {
  name: 'Agile',
};

beforeAll(async () => {
  await connectToDatabase();
  await initUsersWithSampleUser();

  await Book.sync();
  await Borrow.sync();
  await Tag.sync();
  await ConnectionBookTag.sync();
  await QueueEntry.sync();
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('GET /api/books', () => {
  beforeEach(async () => {
    await Book.destroy({ where: {} });
    await Tag.destroy({ where: {} });
    await ConnectionBookTag.destroy({ where: {} });
    await Borrow.destroy({ where: {} });

    const sampleBookDb = await Book.create(sampleBook);
    const SampleTagDb = await Tag.create(sampleTag);
    await Book.create(sampleBook2);

    await ConnectionBookTag.create({
      bookId: sampleBookDb.id,
      tagId: SampleTagDb.id,
    });

    await Borrow.create({
      bookId: sampleBookDb.id,
      borrowedDate: new Date(),
      userGoogleId: 'sample_google_id',
      active: true,
    });
  });

  it('should return correct books ', async () => {
    const response = await api.get('/api/books');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);

    const titles = response.body.map((book: Book) => book.title);
    expect(titles).toContain(sampleBook.title);
    expect(titles).toContain(sampleBook2.title);
  });

  it('should return correct books with borrowedByMe info', async () => {
    const response = await api.get('/api/books').expect(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: sampleBook.title, borrowedByMe: true }),
        expect.objectContaining({ title: sampleBook2.title, borrowedByMe: false }),
      ]),
    );
  });

  it('should return correct books with correct tags', async () => {
    const response = await api.get('/api/books').expect(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ tags: [expect.objectContaining({ name: sampleTag.name })] }),
        expect.objectContaining({ tags: [] }),
      ]),
    );
  });
});

describe('POST /api/books', () => {
  beforeEach(async () => {
    await Book.destroy({ where: {} });
    await Tag.destroy({ where: {} });
    await ConnectionBookTag.destroy({ where: {} });
  });

  it('should create a new book and return correct book', async () => {
    const response = await api.post('/api/books').send({ ...sampleBook, tags: [] });
    expect(response.status).toBe(201);
    expect(await Book.count()).toBe(1);

    expect(response.body.title).toBe(sampleBook.title);
    expect(response.body.authors).toBe(sampleBook.authors);
    expect(response.body.isbn).toBe(sampleBook.isbn);
    expect(response.body.description).toBe(sampleBook.description);
    expect(response.body.publishedDate).toBe(sampleBook.publishedDate);
    expect(response.body.location).toBe(sampleBook.location);
    expect(response.body.copies).toBe(1);
    expect(response.body.copiesAvailable).toBe(1);
    expect(response.body).not.toContain('userGoogleId');
  });

  it('should return 400 if ISBN is invalid', async () => {
    const invalidBook = { ...sampleBook, isbn: 'invalid_isbn' };

    const response = await api.post('/api/books').send(invalidBook);
    expect(response.status).toBe(400);
    expect(await Book.count()).toBe(0);
  });

  it('should return 500 if there is an error', async () => {
    jest.spyOn(Book, 'create').mockImplementationOnce(() => {
      throw new Error('sample error');
    });

    const response = await api.post('/api/books').send(sampleBook);
    expect(response.status).toBe(500);
    expect(await Book.count()).toBe(0);
  });
});

describe('POST /api/books/:id/borrow', () => {
  beforeEach(async () => {
    await Borrow.destroy({ where: {} });
    await Book.destroy({ where: {} });
  });

  it('should borrow a book and return the updated book with dueDate', async () => {
    const book = await Book.create(sampleBook);
    const response = await api.post(`/api/books/${book.id}/borrow`);
    expect(response.status).toBe(200);

    const updatedBook = await Book.findOne({ where: { id: book.id } });
    expect(updatedBook?.copiesAvailable).toBe(0);

    const borrow = await Borrow.findOne({ where: { bookId: book.id } });
    expect(borrow?.userGoogleId).toBe('sample_google_id');
    expect(borrow?.borrowedDate).not.toBe(null);

    const expectedDueDate = borrow?.borrowedDate ? new Date(borrow.borrowedDate) : new Date();
    expectedDueDate.setDate(expectedDueDate.getDate() + 30);
    expect(new Date(response.body.dueDate).toISOString()).toBe(expectedDueDate.toISOString());
  });

  it('should return 403 if the book is not available', async () => {
    const book = await Book.create({
      ...sampleBook,
      copiesAvailable: 0,
    });

    const response = await api.post(`/api/books/${book.id}/borrow`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('book is not available');
  });

  it('should return 404 if the book does not exist', async () => {
    const response = await api.post('/api/books/999/borrow');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('book does not exist');
  });
});

describe('POST /api/books/:id/return', () => {
  beforeEach(async () => {
    await Borrow.destroy({ where: {} });
    await Book.destroy({ where: {} });
  });

  it('should return a book and update its status', async () => {
    const bookId = (await Book.create({ ...sampleBook, copiesAvailable: 0 })).id;
    await Borrow.create({
      bookId,
      borrowedDate: new Date(),
      userGoogleId: 'sample_google_id',
      active: true,
    });

    const response = await api.post(`/api/books/${bookId}/return`);
    expect(response.status).toBe(200);

    const updatedBook = await Book.findOne({ where: { id: bookId } });
    expect(updatedBook?.copiesAvailable).toBe(1);
  });

  it('should return 404 if the book does not exist', async () => {
    const response = await api.post('/api/books/999/return');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('book does not exist');
  });
});
