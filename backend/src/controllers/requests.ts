import expresss from 'express';

import { User } from '../models';
import BookRequest from '../models/book_request';
import { sequelize } from '../util/db';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { requireLogin } from '../util/middleware/requireLogin';

const router = expresss.Router();

router.get('/', requireAdmin, async (req, res) => {
  const data = await BookRequest.findAll({
    attributes: [
      'isbn',
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
      [sequelize.fn('STRING_AGG', sequelize.col('user_google_id'), ';'), 'user_emails'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'request_count'],
    ],
    group: ['isbn', 'user.google_id'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    include: [
      {
        model: User,
        attributes: ['email'],
        required: false,
      },
    ],
  });

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

export default router;
