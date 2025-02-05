import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../util/config';

import { Request, Response, NextFunction, RequestHandler } from 'express';

const tokenExtractor: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const { id } = jwt.verify(authorization.substring(7), JWT_SECRET) as JwtPayload;

      req.UserId = id;
    } catch (error) {
      console.log(error);
    }
  }

  next();
};

export { tokenExtractor };
