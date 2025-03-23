/* eslint-disable no-undef */
import supertest from 'supertest';
import { tokenExtractor } from '../src/util/middleware/tokenExtractor';

jest.mock('../src/util/middleware/tokenExtractor');
const tokenExtractorMock = jest.mocked(tokenExtractor);

import app from '../src/app';
const api = supertest(app);

afterAll(() => {
  jest.clearAllMocks();
});

describe('Access control', () => {
  it('Endpoints requiring login', async () => {
    tokenExtractorMock.mockImplementation((_req, _res, next) => {
      next();
    });

    await api.get('/api/books').expect(401);
    await api.post('/api/books/0/borrow').expect(401);
    await api.post('/api/books/0/return').expect(401);
    await api.put('/api/books/0/reserve').expect(401);
    await api.delete('/api/books/0/unreserve').expect(401);
    await api.get('/api/tags').expect(401);
  });

  it('Endpoints requiring admin', async () => {
    tokenExtractorMock.mockImplementation((req, _res, next) => {
      req.userId = 'sample_google_id';
      req.admin = false;
      next();
    });

    await api.post('/api/books').expect(403);
    await api.put('/api/books/0').expect(403);
    await api.delete('/api/books/0').expect(403);
    await api.get('/api/books/borrows').expect(403);

    await api.post('/api/isbn').expect(403);

    await api.post('/api/tags').expect(403);
    await api.put('/api/tags/0').expect(403);
    await api.delete('/api/tags/0').expect(403);

    await api.post('/api/admin').expect(403);

    await api.get('/api/users').expect(403);
  });
});
