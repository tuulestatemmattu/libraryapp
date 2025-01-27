import express from 'express';
import cors from 'cors';
import path from 'path';

import { PORT, NODE_ENV } from './util/config';
import { connectToDatabase } from './util/db';
import loginRouter from './controllers/login';
import isbnRouter from './controllers/isbn_api';

const app = express();
app.use(express.json())
app.use(cors());

app.use('/api/login', loginRouter);
app.use('/api/isbn', isbnRouter)


if (NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

const start = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
