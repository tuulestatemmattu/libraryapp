import { PORT } from './util/config';
import { connectToDatabase } from './util/db';
import app from './app';

const start = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
