import { QueryTypes } from 'sequelize';

const Sequelize = require('sequelize');
const { DATABASE_URL, NODE_ENV } = require('./config');

const dialectOptions = NODE_ENV === 'production' ? {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
} : {};

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
  dialectOptions
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();

    console.log('database connected');
  } catch (err) {
    console.log(err);
    console.log('connecting database failed');
    return process.exit(1);
  }

  return null;
};

export { connectToDatabase, sequelize };
