/* eslint-disable no-undef */
import supertest from 'supertest';

import app from '../src/app';
import { Book, Borrow, ConnectionBookTag, Tag, User } from '../src/models';
import { connectToDatabase, disconnectDatabase } from '../src/util/db';

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

jest.mock('../src/util/middleware/tokenExtractor', () => ({
  tokenExtractor: jest.fn((req, _res, next) => {
    req.userId = 'sample_google_id';
    req.admin = true;
    next();
  }),
}));

beforeAll(async () => {
  await connectToDatabase();

  await User.sync();
  await User.destroy({ where: {} });
  await User.create({
    google_id: 'sample_google_id',
    email: 'sample_email@example.com',
    picture: 'sample_picture_url',
    name: 'Sample Name',
  });
  await Book.sync();
  await Borrow.sync();
  await Borrow.destroy({ where: {} });
  await Tag.sync();
  await ConnectionBookTag.sync();
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('GET /api/books', () => {
  beforeEach(async () => {
    await Book.destroy({ where: {} });
    await Tag.destroy({ where: {} });
    await ConnectionBookTag.destroy({ where: {} });
    await Book.create({
      ...sampleBook,
    });
    await Book.create({
      ...sampleBook2,
    });
    await Tag.create({
      ...sampleTag,
    });
    const sampleBookFromDb = await Book.findOne({ where: { title: sampleBook.title } });
    const sampleBookId = sampleBookFromDb ? sampleBookFromDb.id : 0;

    const sampleTagFromDb = await Tag.findOne({ where: { name: sampleTag.name } });
    const sampleTagId = sampleTagFromDb ? sampleTagFromDb.id : 0;

    await ConnectionBookTag.create({
      bookId: sampleBookId,
      tagId: sampleTagId,
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
    const response = await api.get('/api/books');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);

    const books = response.body;
    const states = [books[0].borrowedByMe, books[1].borrowedByMe];
    expect(states).toContain(false);
    expect(states).toContain(false);
  });

  it('should return correct books with correct tags', async () => {
    const response = await api.get('/api/books');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);

    const books = response.body;
    expect(books[0].tags.length).toBe(1);
    expect(books[0].tags[0]).toMatchObject({ name: sampleTag.name });
    expect(books[1].tags.length).toBe(0);
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

describe('PUT /api/books/borrow/:id', () => {
  beforeEach(async () => {
    await Borrow.destroy({ where: {} });
    await Book.destroy({ where: {} });
  });

  it('should borrow a book and return the updated book', async () => {
    const book = await Book.create({
      ...sampleBook,
    });
    const response = await api.put(`/api/books/borrow/${book?.id}`);
    expect(response.status).toBe(200);

    const updatedBook = await Book.findOne({ where: { id: book?.id } });
    expect(updatedBook?.copiesAvailable).toBe(0);

    const borrow = await Borrow.findOne({ where: { bookId: book?.id } });
    expect(borrow?.userGoogleId).toBe('sample_google_id');
    expect(borrow?.borrowedDate).not.toBe(null);
  });

  it('should return 403 if the book is not available', async () => {
    const book = await Book.create({
      ...sampleBook,
      copiesAvailable: 0,
    });

    const response = await api.put(`/api/books/borrow/${book?.id}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('book is not available');
  });

  it('should return 404 if the book does not exist', async () => {
    const response = await api.put('/api/books/borrow/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('book does not exist');
  });
});

describe('PUT /api/books/return/:id', () => {
  beforeEach(async () => {
    await Borrow.destroy({ where: {} });
    await Book.destroy({ where: {} });
    await Book.create({
      ...sampleBook,
    });
  });

  it('should return a book and update its status', async () => {
    const book = await Book.findOne({ where: { isbn: sampleBook.isbn } });
    await api.put(`/api/books/borrow/${book?.id}`);
    const response = await api.put(`/api/books/return/${book?.id}`);
    expect(response.status).toBe(200);

    const updatedBook = await Book.findOne({ where: { id: book?.id } });
    expect(updatedBook?.copiesAvailable).toBe(1);
  });

  it('should return 404 if the book does not exist', async () => {
    const response = await api.put('/api/books/return/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('book does not exist');
  });
});
