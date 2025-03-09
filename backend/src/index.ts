import app from './app';
import { syncModels } from './models';
import { PORT } from './util/config';
import { connectToDatabase } from './util/db';

const start = async () => {
  await connectToDatabase();
  await syncModels();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
