/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app';

const api = supertest(app);

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
