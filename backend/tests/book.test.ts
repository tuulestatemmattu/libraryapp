/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app';
import Book from '../src/models/book';
import { connectToDatabase, disconnectDatabase } from '../src/util/db';

const api = supertest(app);

beforeAll(async () => {
    await connectToDatabase();
});

jest.mock('../src/models/book');

describe('POST /api/books', () => {
    it('should create a new book and return 201 status', async () => {
        const newBook = {
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            authors: 'Robert C. Martin',
            isbn: '9780132350884',
            description: 'A handbook of agile software craftsmanship.',
            publishedDate: '2009',
        };

        (Book.findOne as jest.Mock).mockResolvedValue(null);
        (Book.create as jest.Mock).mockResolvedValue(newBook);

        const response = await api.post('/api/books').send(newBook);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newBook);
    });

    it('should update an existing book and return 200 status', async () => {
        const existingBook = {
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            authors: 'Robert C. Martin',
            isbn: '9780132350884',
            description: 'A handbook of agile software craftsmanship.',
            publishedDate: '2009',
        };


        const updatedBook = {
            ...existingBook,
            description: 'A handbook',
            };
    

        (Book.findOne as jest.Mock).mockResolvedValueOnce(existingBook);
        (Book.update as jest.Mock).mockResolvedValue([1]);
        (Book.findOne as jest.Mock).mockResolvedValueOnce(updatedBook);

        const response = await api.post('/api/books').send(updatedBook);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedBook);
    });

    it('should return 500 status on error', async () => {
        const newBook = {};
        const response = await api.post('/api/books').send(newBook);
        expect(response.status).toBe(500);
    });

    it('should return 400 status for invalid publishedDate', async () => {
        const newBook = {
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            authors: 'Robert C. Martin',
            isbn: '9780132350884',
            description: 'A handbook of agile software craftsmanship.',
            publishedDate: '1800',
        };

        const response = await api.post('/api/books').send(newBook);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Invalid year'});
    });
});

afterAll(async () => {
    await disconnectDatabase();
});