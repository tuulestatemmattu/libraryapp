import express from 'express';
import { Op } from 'sequelize';

import { Book, Borrow, User } from '../models';
import { calculateDueDate } from '../util/bookUtils';
import { CRON_SECRET } from '../util/config';
import { sendPrivateMessage } from '../util/slackbot';

const router = express.Router();

router.post('/', async (req, res) => {
  const { secret } = req.body;
  if (secret != CRON_SECRET) {
    res.status(401).json({ message: 'invalid or missing secret' });
    return;
  }

  const baseDate = new Date();
  const firstNotificationLimit = new Date(baseDate.setDate(baseDate.getDate() + 30 - 7));
  const secondNotificationLimit = new Date(baseDate.setDate(baseDate.getDate() + 30 - 1));

  const where = {
    active: true,
    [Op.or]: [
      {
        notificationsSent: 0,
        borrowedDate: {
          [Op.lte]: firstNotificationLimit,
        },
      },
      {
        notificationsSent: 1,
        borrowedDate: {
          [Op.lte]: secondNotificationLimit,
        },
      },
    ],
  };

  const borrows = await Borrow.findAll({
    where,
    attributes: ['borrowedDate', 'notificationsSent'],
    include: [
      {
        model: User,
        attributes: ['email'],
      },
      {
        model: Book,
        attributes: ['title', 'authors'],
      },
    ],
  });

  for (const borrow of borrows) {
    if (!borrow.user || !borrow.book) {
      throw new Error("Borrow entry doesn't have correct user or book");
    }

    const dueDate = calculateDueDate(borrow.borrowedDate).toDateString();
    await sendPrivateMessage(
      borrow.user.email,
      `Your book ${borrow.book.title} by ${borrow.book.authors} is due ${dueDate}`,
    );
  }

  await Borrow.increment('notificationsSent', {
    by: 1,
    where,
  });

  res.status(200).end();
});

export default router;
