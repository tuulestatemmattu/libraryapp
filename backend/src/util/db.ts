import { Sequelize } from 'sequelize';

import { DATABASE_URL, NODE_ENV, TEST_DATABASE_URL } from './config';

const dialectOptions =
  NODE_ENV === 'production'
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {};

const url = NODE_ENV === 'test' ? TEST_DATABASE_URL : DATABASE_URL;

const sequelize = new Sequelize(url, {
  logging: false,
  dialect: 'postgres',
  dialectOptions,
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
  } catch (err) {
    console.log(err);
    console.log('connecting database failed');
    return process.exit(1);
  }

  return null;
};

const disconnectDatabase = async () => {
  await sequelize.close();
};

export { sequelize, connectToDatabase, disconnectDatabase };
