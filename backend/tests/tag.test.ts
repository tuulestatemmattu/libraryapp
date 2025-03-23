/* eslint-disable no-undef */
import supertest from 'supertest';
import { Tag } from '../src/models';
import { connectToDatabase, disconnectDatabase } from '../src/util/db';
import { initUsersWithSampleUser, mockTokenExtractor } from './common';

mockTokenExtractor('sample_google_id', true);

import app from '../src/app';
const api = supertest(app);

const sampleTag = {
  name: 'Agile',
};

beforeAll(async () => {
  await connectToDatabase();
  await initUsersWithSampleUser();
  await Tag.sync();
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('GET /api/tags', () => {
  test('should return all tags', async () => {
    await Tag.destroy({ where: {} });
    await Tag.create(sampleTag);

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
    await Tag.destroy({ where: {} });
    await Tag.create(sampleTag);
  });

  test('should create a new tag', async () => {
    const newTag = { name: 'Scrum' };
    const response = await api
      .post('/api/tags')
      .send(newTag)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(response.body.name).toBe(newTag.name);

    const tagsAfterAdd = await Tag.findAll();
    expect(tagsAfterAdd).toHaveLength(2);
  });

  test('should not create a tag with an existing name', async () => {
    await api.post('/api/tags').send(sampleTag).expect(500);

    const tagsAfterAdd = await Tag.findAll();
    expect(tagsAfterAdd).toHaveLength(1);
  });
});

describe('DELETE /api/tags/:id', () => {
  beforeEach(async () => {
    await Tag.destroy({ where: {} });
  });

  test('should delete a tag by id', async () => {
    const tagId = (await Tag.create(sampleTag)).id;
    await api.delete(`/api/tags/${tagId}`).expect(204);

    const tagsAfterDelete = await Tag.findAll();
    expect(tagsAfterDelete).toHaveLength(0);
  });

  test('should return 404 if tag does not exist', async () => {
    await api.delete('/api/tags/9999').expect(404);
  });
});
