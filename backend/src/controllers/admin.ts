import { Router } from 'express';

import { User } from '../models';
import { requireAdmin } from '../util/middleware/requireAdmin';

const router = Router();
router.use(requireAdmin);

router.post('/promote', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    user.admin = true;
    await user.save();
    res.status(200).end();
  } catch (error) {
    console.error('Error while promoting user to admin:', error);
    res.status(500).end();
  }
});

router.post('/demote', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }
    user.admin = false;
    await user.save();
    res.status(200).end();
  } catch (error) {
    console.error('Error while demoting user:', error);
    res.status(500).end();
  }
});
export default router;
