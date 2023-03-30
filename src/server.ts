import express, { Application } from 'express';
import { CONFIG } from './config/config';
import { startBot } from './helpers';
import configMiddleware from './middlewares/appMiddleware';
import configRoutes from './routes';

const app: Application = express();

const main = async () => {
  // Middlewares
  configMiddleware(app);
  // Routes
  configRoutes(app);

  app.listen(CONFIG.PORT, () => {
    console.log(`server starting on port ${CONFIG.PORT}`);
    startBot();
  });
};

main().catch((e) => console.log(e));
