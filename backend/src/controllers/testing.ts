import crypto from 'crypto';
import express from 'express';
import jwt from 'jsonwebtoken';

import { User, resetTables } from '../models';
import { CRON_SECRET, JWT_SECRET } from '../util/config';

const router = express.Router();

router.get('/resetdb', async (req, res) => {
  const { secret } = req.body;
  if (
    !secret ||
    secret.length != CRON_SECRET.length ||
    !crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(CRON_SECRET))
  ) {
    res.status(401).json({ message: 'invalid or missing secret' });
    return;
  }

  await resetTables();
  await User.create({
    google_id: 'test_google_id',
    name: 'Test user',
    email: 'test.user@example.com',
    picture: 'sample_picture_url',
    admin: true,
  });

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
