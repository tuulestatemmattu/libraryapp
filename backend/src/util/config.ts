require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://TODO',
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
};