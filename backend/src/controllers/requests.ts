import express from 'express';
import { Op } from 'sequelize';

import { User } from '../models';
import BookRequest from '../models/book_request';
import { sequelize } from '../util/db';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { requireLogin } from '../util/middleware/requireLogin';
import { sendPrivateMessage } from '../util/slackbot';

const router = express.Router();

const getBookRequests = async () => {
  const data = await BookRequest.findAll({
    attributes: [
      'isbn',
      [sequelize.fn('MIN', sequelize.col('status')), 'status'],
      [sequelize.fn('MIN', sequelize.col('id')), 'id'],
      [
        sequelize.literal("(ARRAY_AGG(title) FILTER (WHERE title IS NOT NULL AND title <> ''))[1]"),
        'title',
      ],
      [
        sequelize.literal(
          "(ARRAY_AGG(author) FILTER (WHERE author IS NOT NULL AND author <> ''))[1]",
        ),
        'author',
      ],
      [sequelize.fn('STRING_AGG', sequelize.col('email'), ';'), 'user_emails'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'request_count'],
    ],
    group: ['isbn', 'user.google_id'],
    order: [
      // First, order by status: open -> accepted -> rejected
      [
        sequelize.literal(
          `CASE 
            WHEN MIN(status) = 'open' THEN 0 
            WHEN MIN(status) = 'accepted' THEN 1 
            WHEN MIN(status) = 'rejected' THEN 2 
            ELSE 3 
          END`,
        ),
        'ASC',
      ],
      // Second, order by request count (descending) within each status group
      [sequelize.fn('COUNT', sequelize.col('id')), 'DESC'],
    ],
    include: [
      {
        model: User,
        attributes: ['email'],
        required: false,
      },
    ],
  });
  return data;
};

router.get('/', requireAdmin, async (req, res) => {
  const data = await getBookRequests();
  const bookRequests = data.map((bookRequest) => bookRequest.toJSON());
  res.json(bookRequests);
});

router.post('/', requireLogin, async (req, res) => {
  const userId = req.userId as string;
  const { title, author, isbn } = req.body;

  const bookRequest = await BookRequest.create({
    user_google_id: userId,
    title,
    author,
    isbn,
    status: 'open',
  });
  res.status(201).send(bookRequest);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const requestId = req.params.id;
  const requestTodelete = await BookRequest.findByPk(requestId);
  if (!requestTodelete) {
    res.status(404).send({ message: 'Request not found' });
    return;
  }
  await requestTodelete.destroy();
  res.status(204).send();
});

router.put('/:id', requireAdmin, async (req, res) => {
  const { message, status } = req.body;
  const id = parseInt(req.params.id);

  const bookRequests = await BookRequest.findAll({
    where: {
      [Op.or]: [
        { id },
        sequelize.where(
          sequelize.col('isbn'),
          '=',
          sequelize.literal(`(SELECT isbn FROM book_requests WHERE id = ${id})`),
        ),
      ],
    },
    attributes: ['id', 'title', 'author', 'isbn', 'status', 'user_google_id'],
    include: [
      {
        model: User,
        attributes: ['name', 'email'],
      },
    ],
  });

  if (bookRequests.length === 0) {
    res.status(404).send({ message: 'Book request not found' });
    return;
  }

  for (const bookRequest of bookRequests) {
    let msg_status = status;
    if (bookRequest.status === 'delivered' && status === 'accepted') {
      msg_status = 'reverted to accepted';
    }
    await bookRequest.update({ status: status });

    const user_message = `Your request for book "${bookRequest.title}" was ${msg_status}.\nMessage from administrator: ${message}`;
    await sendPrivateMessage(bookRequest.user?.email as string, user_message);
  }

  const data = await getBookRequests();
  const bookRequest = data.find((bookRequest) => bookRequest.id === id) as BookRequest;
  res.status(200).json(bookRequest);
});

export default router;
