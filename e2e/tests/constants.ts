require("dotenv").config();

export const FRONTEND_URL = process.env.FRONTEND_URL || "FRONTEND_URL_NOT_SET";
export const BACKEND_URL = process.env.BACKEND_URL || "BACKEND_URL_NOT_SET";
export const CRON_SECRET = process.env.CRON_SECRET || "CRON_SECRET_NOT_SET";
