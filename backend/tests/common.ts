/* eslint-disable no-undef */
import { User } from '../src/models';

export const mockTokenExtractor = (userId = 'sample_google_id', admin = true) => {
  jest.mock('../src/util/middleware/tokenExtractor', () => ({
    tokenExtractor: jest.fn((req, _res, next) => {
      req.userId = userId;
      req.admin = admin;
      next();
    }),
  }));
};

export const initUsersWithSampleUser = async () => {
  await User.sync();
  await User.destroy({ where: {} });
  await User.create({
    google_id: 'sample_google_id',
    email: 'sample_email@example.com',
    picture: 'sample_picture_url',
    name: 'Sample Name',
    admin: true,
  });
};
