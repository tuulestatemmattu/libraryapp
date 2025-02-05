import express from 'express';
import cors from 'cors';
import path from 'path';

import { NODE_ENV } from './util/config';
import loginRouter from './controllers/login';
import isbnRouter from './controllers/isbn_api';
import bookRouter from './controllers/book';
import bookValidator from './util/validation';
import { tokenExtractor } from './util/middleware';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      UserId?: number;
    }
  }
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(tokenExtractor);

app.use('/api/login', loginRouter);
app.use('/api/books', bookValidator, bookRouter);
app.use('/api/isbn', isbnRouter);
app.use('/api/books', bookRouter);

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

if (NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

export default app;
