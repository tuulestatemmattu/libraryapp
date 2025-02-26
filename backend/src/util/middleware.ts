import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../util/config';

import { Request, Response, NextFunction, RequestHandler } from 'express';

const tokenExtractor: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const { id, admin } = jwt.verify(authorization.substring(7), JWT_SECRET) as JwtPayload;
      req.userId = id;
      req.admin = admin;
      return next();
    } catch (error) {
      console.log(error);
    }
  }
  res.status(401).json({ error: 'token missing or invalid' });
};

export { tokenExtractor };
