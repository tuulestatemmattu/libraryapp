import expresss from 'express';

import { User } from '../models';
import BookRequest from '../models/book_request';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { requireLogin } from '../util/middleware/requireLogin';
import { sendPrivateMessage } from '../util/slackbot';

//import { sendPrivateMessage } from '../util/slackbot';

const router = expresss.Router();

router.get('/', requireAdmin, async (req, res) => {
  const data = await BookRequest.findAll({
    attributes: ['id', 'title', 'author', 'isbn', 'status'],
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
  const id = req.params.id;
  const bookRequest = await BookRequest.findByPk(id, {
    attributes: ['id', 'title', 'author', 'isbn', 'status', 'user_google_id'],
    include: [
      {
        model: User,
        attributes: ['name', 'email'],
      },
    ],
  });
  if (bookRequest) {
    const editedRequest = { ...BookRequest, status: status };
    await bookRequest.update(editedRequest);
    res.status(200).send(bookRequest);
    const user = await User.findByPk(bookRequest.dataValues.user_google_id, {
      attributes: ['email'],
    });
    const user_message = `Your request for book "${bookRequest.title}" was ${status}.\nMessage from administrator: ${message}`;
    if (user) {
      await sendPrivateMessage(user.email, user_message);
    }
  } else {
    res.status(404).send({ message: 'Book request not found' });
  }
});

export default router;
