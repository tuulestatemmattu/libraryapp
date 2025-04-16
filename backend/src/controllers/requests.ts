import expresss from 'express';
import { QueryTypes } from 'sequelize';

import BookRequest from '../models/book_request';
import { sequelize } from '../util/db';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { requireLogin } from '../util/middleware/requireLogin';

const router = expresss.Router();

router.get('/', requireAdmin, async (req, res) => {
  const data = await sequelize.query(
    `
      SELECT
        MIN(br.id) AS id,
        (ARRAY_AGG(br.title) FILTER (WHERE br.title IS NOT NULL))[1] AS title,
        (ARRAY_AGG(br.author) FILTER (WHERE br.author IS NOT NULL))[1] AS author,
        (ARRAY_AGG(br.isbn) FILTER (WHERE br.isbn IS NOT NULL))[1] AS isbn,
        COUNT(DISTINCT br2.id) AS request_count
      FROM book_requests br
      LEFT JOIN book_requests br2
        ON br.isbn = br2.isbn OR br.title = br2.title
      ORDER BY request_count DESC
    `,
    {
      type: QueryTypes.SELECT,
    },
  );

  console.log(data);
  //const bookRequests = data.map((bookRequest) => bookRequest.toJSON());
  //res.json(bookRequests);
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
