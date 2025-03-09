/* eslint-disable no-undef */
import supertest from 'supertest';

import app from '../src/app';
import { User } from '../src/models';
import { connectToDatabase, disconnectDatabase } from '../src/util/db';

const api = supertest(app);

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
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('POST /api/admin', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
    await User.create({
      google_id: 'to_be_admin',
      email: 'to_be_admin@example.com',
      picture: 'to_be_admin_picture_url',
      name: 'ToBeAdmin',
      admin: false,
    });
  });

  it('should promote user to admin', async () => {
    await api.post('/api/admin').send({ email: 'to_be_admin@example.com' }).expect(200);

    const user = await User.findOne({ where: { email: 'to_be_admin@example.com' } });
    expect(user?.admin).toBe(true);
  });

  it('should return 404 if user not found', async () => {
    const response = await api
      .post('/api/admin')
      .send({ email: 'non_existent@example.com' })
      .expect(404);

    expect(response.body.message).toBe('User not found');
  });
});
