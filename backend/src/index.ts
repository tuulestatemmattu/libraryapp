import { PORT } from './util/config';
import { connectToDatabase } from './util/db';
import app from './app';
import { syncModels } from './models';

const start = async () => {
  await connectToDatabase();
  await syncModels();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
