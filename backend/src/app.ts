import express from 'express';
import cors from 'cors';
import path from 'path';

import { NODE_ENV } from './util/config';
import loginRouter from './controllers/login';
import isbnRouter from './controllers/isbn_api';
import bookRouter from './controllers/book';
import tagRouter from './controllers/tag';
import testingRouter from './controllers/testing';
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
app.use('/api/books', bookRouter);
app.use('/api/tags', tagRouter);

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

if (NODE_ENV == 'development' || NODE_ENV == 'test') {
  app.use('/api/testing', testingRouter);
}

if (NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

export default app;
