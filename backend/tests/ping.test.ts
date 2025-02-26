/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app';

const api = supertest(app);

jest.mock('../src/util/middleware', () => ({
  tokenExtractor: jest.fn((req, _res, next) => {
    req.userId = 'sample_google_id';
    req.admin = true;
    next();
  }),
}));

describe('GET /api/ping', () => {
  it('should return 200 OK', async () => {
    const response = await api.get('/api/ping');
    expect(response.status).toBe(200);
  });

  it('should return "pong"', async () => {
    const response = await api.get('/api/ping');
    expect(response.text).toBe('pong');
  });
});
