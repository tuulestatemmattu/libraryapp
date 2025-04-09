import expresss from 'express';

import BookRequest from '../models/book_request';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { requireLogin } from '../util/middleware/requireLogin';

const router = expresss.Router();

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
