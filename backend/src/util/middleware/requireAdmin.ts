import { Request, Response, NextFunction, RequestHandler } from 'express';

// Must be used after tokenExtractor
export const requireAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.admin) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }
  next();
};
