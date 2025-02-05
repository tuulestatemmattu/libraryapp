import { Request, Response, NextFunction } from 'express';
import isIsbn from 'validator/lib/isISBN';

const bookValidator = (req: Request, res: Response, next: NextFunction) => {
  const { isbn, publishedDate } = req.body;

  if (!isIsbn(isbn)) {
    res.status(400).send({ message: 'Invalid ISBN' });
    return;
  }

  if (!/^(19|20)\d{2}$/.test(publishedDate)) {
    res.status(400).send({ message: 'Invalid year' });
    return;
  }

  next();
};

export default bookValidator;
