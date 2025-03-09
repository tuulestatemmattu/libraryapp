import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { JWT_SECRET } from '../../util/config';

export const tokenExtractor: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const { id, admin } = jwt.verify(authorization.substring(7), JWT_SECRET) as JwtPayload;
      req.userId = id;
      req.admin = admin;
    } catch (error) {
      console.log(error);
    }
  }
  next();
};
