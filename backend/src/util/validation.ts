import { NextFunction, Request, Response } from 'express';
import isIsbn from 'validator/lib/isISBN';

const bookValidator = (req: Request, res: Response, next: NextFunction) => {
  const { isbn } = req.body;

  if (!isIsbn(isbn)) {
    res.status(400).send({ message: 'Invalid ISBN' });
    return;
  }

  next();
};

export default bookValidator;
