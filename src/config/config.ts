import 'dotenv/config';

export const CONFIG = {
  PORT: process.env.PORT || '',
  API_KEY: process.env.BY_BIT_API_KEY || '',
  API_SECRET: process.env.BY_BIT_API_SECRET || '',
  TEST_NET: true,
  URL: process.env.MAIN_NET_URL || '',
  TELEGRAM_KEY: process.env.TELEGRAM_SECRET || '',
};
