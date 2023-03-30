import express, { Application } from 'express';
import { CONFIG } from './config/config';
import bytbitRouter from './routes/bybit';

const app: Application = express();

const main = async () => {
  app.use('/api/v1/', bytbitRouter); // bybit router

  app.listen(CONFIG.PORT, () => {
    console.log(`server starting on port ${CONFIG.PORT}`);
  });
};

main().catch((e) => console.log(e));
