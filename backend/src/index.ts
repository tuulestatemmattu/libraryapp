import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.port || 3000;

app.get('/ping', (_, res) => {
  res.send('pong');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});