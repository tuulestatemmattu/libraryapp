import { Router } from 'express';
import Book from '../models/book';

const router = Router();

router.get('/', async (_req, res) => {
  const books = await Book.findAll();
  res.send(books);
});

export default router;
