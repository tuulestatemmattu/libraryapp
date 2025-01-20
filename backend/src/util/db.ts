import { QueryTypes } from 'sequelize';

const Sequelize = require('sequelize');
const { DATABASE_URL } = require('./config');

const sequelize = new Sequelize(DATABASE_URL);

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
