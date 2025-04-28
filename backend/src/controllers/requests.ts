import express from 'express';
import { Op, QueryTypes } from 'sequelize';

import { User } from '../models';
import BookRequest from '../models/book_request';
import { sequelize } from '../util/db';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { requireLogin } from '../util/middleware/requireLogin';
import { sendPrivateMessage } from '../util/slackbot';

const router = express.Router();

interface BookRequestData {
  id: number;
  status: string;
  title: string;
  author: string;
  isbn: string;
  user_emails: string;
  request_count: number;
}

const getBookRequests = async () => {
  const data = await sequelize.query(
    `
      SELECT
        MIN(br.id) AS id,
        MIN(br.status) AS status,
        (ARRAY_AGG(br.title) FILTER (WHERE br.title IS NOT NULL))[1] AS title,
        (ARRAY_AGG(br.author) FILTER (WHERE br.author IS NOT NULL))[1] AS author,
        (ARRAY_AGG(br.isbn) FILTER (WHERE br.isbn IS NOT NULL))[1] AS isbn,
        (STRING_AGG(DISTINCT u.email, ';')) AS user_emails,
        COUNT(DISTINCT br2.id) AS request_count
      FROM book_requests br
      LEFT JOIN book_requests br2
        ON br.isbn = br2.isbn OR br.title = br2.title
      LEFT JOIN users u
        ON br.user_google_id = u.google_id
      GROUP BY br.isbn
      ORDER BY 
        CASE 
          WHEN MIN(br.status) = 'open' THEN 0
          WHEN MIN(br.status) = 'accepted' THEN 1
          WHEN MIN(br.status) = 'rejected' THEN 2
          ELSE 3
        END ASC,
        COUNT(DISTINCT br2.id) DESC
    `,
    {
      type: QueryTypes.SELECT,
    },
  );
  return data as BookRequestData[];
};

router.get('/', requireAdmin, async (req, res) => {
  const bookRequests = await getBookRequests();
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
  const bookRequest = data.find((bookRequest) => bookRequest.id === id);
  res.status(200).json(bookRequest);
});

export default router;
