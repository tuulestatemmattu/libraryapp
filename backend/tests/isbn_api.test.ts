/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app';

const api = supertest(app);

const mockResponse = {
  data: {
    totalItems: '1',
    items: [
      {
        volumeInfo: {
          title: 'Test Book',
          authors: ['Test Author'],
          publishedDate: '2020-01-01',
          description: 'Test Description',
          imageLinks: {
            smallThumbnail: 'http://example.com/small.jpg',
            thumbnail: 'http://example.com/large.jpg',
          },
        },
      },
    ],
  },
};

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve(mockResponse)),
}));

describe('ISBN API', () => {
  it('should return book data for a valid ISBN', async () => {
    const response = await api
      .post('/api/isbn')
      .send({ isbn: '9780143127550' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('authors');
    expect(response.body).toHaveProperty('publishedDate');
    expect(response.body).toHaveProperty('isbn', '9780143127550');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('images');
  });
});
