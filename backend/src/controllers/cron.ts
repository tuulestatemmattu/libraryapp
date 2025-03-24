import express from 'express';

import { CRON_SECRET } from '../util/config';

const router = express.Router();

router.post('/', async (req, res) => {
  const { secret } = req.body;
  if (secret != CRON_SECRET) {
    res.status(401).json({ message: 'invalid or missing secret' });
    return;
  }

  console.log('CRON called');
  res.status(200).end();
});

export default router;
