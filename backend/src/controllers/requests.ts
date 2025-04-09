import expresss from 'express';

import { User } from '../models';
import BookRequest from '../models/book_request';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { requireLogin } from '../util/middleware/requireLogin';

const router = expresss.Router();

router.get('/', requireAdmin, async (req, res) => {
  const data = await BookRequest.findAll({
    attributes: ['id', 'title', 'author', 'isbn'],
    include: [
      {
        model: User,
        attributes: ['name', 'email'],
      },
    ],
  });

  const bookRequests = data.map((bookRequest) => bookRequest.toJSON());
  res.json(bookRequests);
});

router.post('/', requireLogin, async (req, res) => {
  const userId = req.userId as string;
  const { title, author, isbn } = req.body;

  try {
    const bookRequest = await BookRequest.create({
      user_google_id: userId,
      title,
      author,
      isbn,
    });
    res.status(201).send(bookRequest);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const requestId = req.params.id;
    const requestTodelete = await BookRequest.findByPk(requestId);
    if (!requestTodelete) {
      res.status(404).send({ message: 'Request not found' });
      return;
    }
    await requestTodelete.destroy();
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});

export default router;
