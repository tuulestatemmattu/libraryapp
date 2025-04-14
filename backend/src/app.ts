import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import path from 'path';

import adminRouter from './controllers/admin';
import bookRouter from './controllers/book';
import cronRouter from './controllers/cron';
import isbnRouter from './controllers/isbn_api';
import locationRouter from './controllers/location';
import loginRouter from './controllers/login';
import requestsRouter from './controllers/requests';
import tagRouter from './controllers/tag';
import testingRouter from './controllers/testing';
import userRouter from './controllers/users';
import { NODE_ENV, STAGING } from './util/config';
import errorHandler from './util/middleware/errorHandler';
import { tokenExtractor } from './util/middleware/tokenExtractor';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      userId?: string;
      admin?: boolean;
    }
  }
}

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/login', loginRouter);
app.use(tokenExtractor);

app.use('/api/books', bookRouter);
app.use('/api/isbn', isbnRouter);
app.use('/api/tags', tagRouter);
app.use('/api/admin', adminRouter);
app.use('/api/users', userRouter);
app.use('/api/cron', cronRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/locations');

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

if (NODE_ENV == 'development' || NODE_ENV == 'test' || STAGING) {
  app.use('/api/testing', testingRouter);
}

if (NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.use(errorHandler);

export default app;
