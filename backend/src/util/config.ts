import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://TODO';
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgres://TODO';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_OAUTH_REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI;

const JWT_SECRET = process.env.JWT_SECRET || '';

const FRONTEND_URL = process.env.FRONTEND_URL || '';

export {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  TEST_DATABASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URI,
  JWT_SECRET,
  FRONTEND_URL,
};
