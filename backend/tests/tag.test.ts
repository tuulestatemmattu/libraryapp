/* eslint-disable no-undef */
import supertest from 'supertest';

import app from '../src/app';
import { Book, ConnectionBookTag, Tag, User } from '../src/models';
import { connectToDatabase, disconnectDatabase } from '../src/util/db';

const api = supertest(app);

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
  await Tag.sync();
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('GET /api/tags', () => {
  beforeEach(async () => {
    await Tag.destroy({ where: {} });
    await Tag.create({
      ...sampleTag,
    });
  });

  test('should return all tags', async () => {
    const response = await api
      .get('/api/tags')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe(sampleTag.name);
  });
});

describe('POST /api/tags', () => {
  beforeEach(async () => {
    await Book.destroy({ where: {} });
    await Tag.destroy({ where: {} });
    await ConnectionBookTag.destroy({ where: {} });
    await Tag.create({
      ...sampleTag,
    });
  });

  test('should create a new tag', async () => {
    const newTag = { name: 'Scrum' };
    const response = await api
      .post('/api/tags')
      .send(newTag)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(response.body.name).toBe(newTag.name);
  });

  test('should not create a tag with an existing name', async () => {
    await api.post('/api/tags').send(sampleTag).expect(500);
  });
});

describe('DELETE /api/tags/:id', () => {
  let tagId: number;

  beforeEach(async () => {
    await Tag.destroy({ where: {} });
    const tag = await Tag.create({
      ...sampleTag,
    });
    tagId = tag.id;
  });

  test('should delete a tag by id', async () => {
    await api.delete(`/api/tags/${tagId}`).expect(204);
    const tagsAfterDelete = await Tag.findAll();
    expect(tagsAfterDelete).toHaveLength(0);
  });

  test('should return 404 if tag does not exist', async () => {
    await api.delete('/api/tags/9999').expect(404);
  });
});
