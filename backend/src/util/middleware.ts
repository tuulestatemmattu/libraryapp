import jwt, { JwtPayload } from 'jsonwebtoken'
import {JWT_SECRET} from '../util/config'

import { Request, Response, NextFunction, RequestHandler } from 'express';


export interface CustomRequest extends Request {
  UserId: number
}




const tokenExtractor: RequestHandler = (req: Request, res: Response, next:NextFunction) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log('here')
      console.log(JWT_SECRET)
      console.log(authorization.substring(7))
      const {id} = jwt.verify(authorization.substring(7), JWT_SECRET) as JwtPayload
     
      (req as CustomRequest).UserId = id
    } catch (error){
      console.log(error)
    }
  }
  
  
  next()
}

export {tokenExtractor}