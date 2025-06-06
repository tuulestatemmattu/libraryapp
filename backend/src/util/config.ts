import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ?? 3001;
const NODE_ENV = process.env.NODE_ENV ?? 'development';
const STAGING = process.env.STAGING ?? 0;

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://TODO';
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ?? 'postgres://TODO';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_OAUTH_REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI;

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN ?? '';
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? '';

const JWT_SECRET = process.env.JWT_SECRET ?? '';
const CRON_SECRET = process.env.CRON_SECRET ?? '';

const FRONTEND_URL = process.env.FRONTEND_URL ?? '';

const LOAN_PERIOD = process.env.LOAN_PERIOD ? parseInt(process.env.LOAN_PERIOD) : 30;

export {
  PORT,
  NODE_ENV,
  STAGING,
  DATABASE_URL,
  TEST_DATABASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URI,
  SLACK_BOT_TOKEN,
  SLACK_WEBHOOK_URL,
  JWT_SECRET,
  CRON_SECRET,
  FRONTEND_URL,
  LOAN_PERIOD,
};
