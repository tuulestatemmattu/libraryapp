import crypto from 'crypto';
import express from 'express';
import jwt from 'jsonwebtoken';

import { Book, User } from '../models';
import { CRON_SECRET, JWT_SECRET } from '../util/config';

const router = express.Router();

router.post('/resetdb', async (req, res) => {
  const { secret } = req.body;
  if (
    !secret ||
    secret.length != CRON_SECRET.length ||
    !crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(CRON_SECRET))
  ) {
    res.status(401).json({ message: 'invalid or missing secret' });
    return;
  }

  await Book.destroy({ where: { location: 'testing' } });

  res.status(200).end();
});

router.post('/login', async (req, res) => {
  const { secret } = req.body;
  if (
    !secret ||
    secret.length != CRON_SECRET.length ||
    !crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(CRON_SECRET))
  ) {
    res.status(401).json({ message: 'invalid or missing secret' });
    return;
  }
  if (!(await User.findOne({ where: { google_id: 'test_google_id' } }))) {
    /* DON'T CHANGE test user info*/
    /* Hardcoded into lighthouse ci */
    await User.create({
      google_id: 'test_google_id',
      name: 'Test user',
      email: 'test.user@example.com',
      picture: 'sample_picture_url',
      admin: true,
    });
  }
  res.cookie(
    'profile',
    JSON.stringify({
      name: 'Test user',
      email: 'test.user@example.com',
      picture: 'sample_picture_url',
      admin: true,
    }),
  );

  const token = jwt.sign({ id: 'test_google_id', admin: true }, JWT_SECRET);
  res.cookie('token', token);

  res.status(200).end();
});

export default router;
