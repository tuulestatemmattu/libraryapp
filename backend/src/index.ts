import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');
const { User } = require('./models/user');

dotenv.config();

const app = express();
app.use(cors());

const port = PORT;

app.get('/ping', (_, res) => {
  res.send('pong');
});

const start = async () => {
  await connectToDatabase();
  User.sync();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
