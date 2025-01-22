import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

const { PORT, NODE_ENV, DATABASE_URL } = require('./util/config');
const { connectToDatabase } = require('./util/db');
const { User } = require('./models/user');

dotenv.config();

const app = express();
app.use(cors());

if (NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

app.get('/api/ping', (_, res) => {
  res.send('pong');
});

const start = async () => {
  if (!DATABASE_URL.includes('TODO')) {
    await connectToDatabase();
    User.sync();
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
