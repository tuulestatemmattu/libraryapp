import express from 'express';
import jwt from 'jsonwebtoken';
import { resetTables, User } from '../models';
import { JWT_SECRET } from '../util/config';

const router = express.Router();

router.get('/resetdb', async (_req, res) => {
  await resetTables();
  await User.create({
    google_id: 'sample_google_id',
    email: 'sample_email@example.com',
    picture: 'sample_picture_url',
    name: 'Sample Name',
  });

  res.status(200).end();
});

router.get('/login', async (_req, res) => {
  res.cookie('user', JSON.stringify({
    name: 'Sample Name',
    email: 'sample_email@example.com',
    picture: 'sample_picture_url',
  }));

  const token = jwt.sign({ id: 'sample_google_id' }, JWT_SECRET);
  res.cookie('token', token);
  
  res.status(200).end();
});

export default router;