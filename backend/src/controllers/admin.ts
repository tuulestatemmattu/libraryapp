import { Router } from 'express';
import { requireAdmin } from '../util/middleware/requireAdmin';
import { User } from '../models';

const router = Router();
router.use(requireAdmin);

router.post('/', async (req, res) => {
  const { email } = req.body;
  console.log(email);

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

export default router;
