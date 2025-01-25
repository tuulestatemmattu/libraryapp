import express from 'express';
import cors from 'cors';
import path from 'path';

import { PORT, NODE_ENV, DATABASE_URL } from './util/config';
import { connectToDatabase } from './util/db';
import loginRouter from './controllers/login';

const app = express();
app.use(cors());

app.use('/api/login', loginRouter);

if (NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

app.get('/api/ping', (_, res) => {
  res.send('pong');
});

const start = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
