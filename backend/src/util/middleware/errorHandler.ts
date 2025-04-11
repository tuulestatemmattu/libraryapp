import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { NODE_ENV } from '../config';

export const requireAdmin: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (NODE_ENV !== 'test') {
    console.log(err);
  }
  res.status(500).json({ message: 'Internal server error' });
};

export default requireAdmin;
