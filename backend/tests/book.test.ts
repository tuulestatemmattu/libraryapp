/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app';
import { connectToDatabase, disconnectDatabase } from '../src/util/db';
import { Book, User } from '../src/models';

const api = supertest(app);

const sampleBook = {
  title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
  authors: 'Robert C. Martin',
  isbn: '9780132350884',
  description: 'A handbook of agile software craftsmanship.',
  publishedDate: '2009',
  location: 'Helsinki',
};

const sampleBook2 = {
  title: 'Harry Potter and the Sorcerer\'s Stone',
  authors: 'J. K. Rowling',
  isbn: '9780590353427',
  description: 'The book that started the magic.',
  publishedDate: '1998',
  location: 'Helsinki',
};


jest.mock('../src/util/middleware', () => ({
  tokenExtractor: jest.fn((req, _res, next) => {
    req.UserId = 'sample_google_id';
    next();
  })
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
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('GET /api/books', () => {
  beforeAll(async () => {
    await Book.destroy({ where: {} });
    await Book.create({
      ...sampleBook,
      lastBorrowedDate: null,
      available: true,
      userGoogleId: 'sample_google_id',
    });
    await Book.create({
      ...sampleBook2,
      lastBorrowedDate: null,
      available: false,
      userGoogleId: 'sample_google_id',
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
    expect(books[0].borrowedByMe).toBe(false);
    expect(books[1].borrowedByMe).toBe(true);
  });
});

describe('POST /api/books', () => {
  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });

  it('should create a new book and return correct book', async () => {
    const response = await api.post('/api/books').send(sampleBook);
    expect(response.status).toBe(201);
    expect(await Book.count()).toBe(1);

    expect(response.body.title).toBe(sampleBook.title);
    expect(response.body.authors).toBe(sampleBook.authors);
    expect(response.body.isbn).toBe(sampleBook.isbn);
    expect(response.body.description).toBe(sampleBook.description);
    expect(response.body.publishedDate).toBe(sampleBook.publishedDate);
    expect(response.body.location).toBe(sampleBook.location);
    expect(response.body.lastBorrowedDate).toBe(null);
    expect(response.body.available).toBe(true);
    expect(response.body.userGoogleId).toBe('sample_google_id');
  });

  it('should update an existing book and return correct book', async () => {
    await api.post('/api/books').send({
      ...sampleBook2, isbn: sampleBook.isbn
    });

    const response = await api.post('/api/books').send(sampleBook);
    expect(response.status).toBe(200);
    expect(await Book.count()).toBe(1);

    expect(response.body.title).toBe(sampleBook.title);
    expect(response.body.authors).toBe(sampleBook.authors);
    expect(response.body.isbn).toBe(sampleBook.isbn);
    expect(response.body.description).toBe(sampleBook.description);
    expect(response.body.publishedDate).toBe(sampleBook.publishedDate);
    expect(response.body.location).toBe(sampleBook.location);
    expect(response.body.lastBorrowedDate).toBe(null);
    expect(response.body.available).toBe(true);
    expect(response.body.userGoogleId).toBe('sample_google_id');
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