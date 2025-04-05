/* eslint-disable no-undef */
import supertest from 'supertest';
import { User } from '../src/models';
import { connectToDatabase, disconnectDatabase } from '../src/util/db';
import { mockTokenExtractor } from './common';

mockTokenExtractor('sample_google_id', true);

import app from '../src/app';
const api = supertest(app);

beforeAll(async () => {
  await connectToDatabase();
  await User.sync();
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('POST /api/admin/promote', () => {
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
    await api.post('/api/admin/promote').send({ email: 'to_be_admin@example.com' }).expect(200);

    const user = await User.findOne({
      where: { email: 'to_be_admin@example.com' },
    });
    expect(user?.admin).toBe(true);
  });

  it('should return 404 if user not found', async () => {
    await api.post('/api/admin/promote').send({ email: 'non_existent@example.com' }).expect(404);
  });
});
