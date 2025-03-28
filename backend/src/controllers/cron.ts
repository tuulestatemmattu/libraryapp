import express from 'express';
import { Op } from 'sequelize';

import { Book, Borrow, User } from '../models';
import { calculateDueDate } from '../util/bookUtils';
import { CRON_SECRET, LOAN_PERIOD } from '../util/config';
import { sendPrivateMessage } from '../util/slackbot';

const router = express.Router();

router.post('/', async (req, res) => {
  const { secret } = req.body;
  if (secret != CRON_SECRET) {
    res.status(401).json({ message: 'invalid or missing secret' });
    return;
  }

  const dateNow = new Date();
  const firstNotificationLimit = new Date(dateNow);
  const secondNotificationLimit = new Date(dateNow);
  firstNotificationLimit.setDate(dateNow.getDate() - LOAN_PERIOD + 7);
  secondNotificationLimit.setDate(dateNow.getDate() - LOAN_PERIOD + 1);

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
    sendPrivateMessage(
      borrow.user.email,
      `Your book _${borrow.book.title}_ by _${borrow.book.authors}_ is due ${dueDate}`,
    ).catch((err) => console.error('Failed to send Slack notification:', err));
  }

  await Borrow.increment('notificationsSent', {
    by: 1,
    where,
  });

  res.status(200).end();
});

export default router;
