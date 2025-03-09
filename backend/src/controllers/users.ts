import { Router } from 'express';

import { User } from '../models';
import { requireAdmin } from '../util/middleware/requireAdmin';

const router = Router();
router.use(requireAdmin);

router.get('/', async (req, res) => {
  const data = await User.findAll({ attributes: ['name', 'email', 'picture', 'admin'] });
  const users = data.map((u) => u.toJSON());

  res.json(users);
});

export default router;
