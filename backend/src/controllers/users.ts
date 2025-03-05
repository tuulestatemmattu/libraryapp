import { Router } from 'express';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { User } from '../models';

const router = Router();
router.use(requireAdmin);

router.get('/', async (req, res) => {
  const data = await User.findAll({ attributes: ['name', 'email', 'picture', 'admin'] });
  const users = data.map((u) => u.toJSON());

  res.json(users);
});

export default router;
