import express, { Application } from 'express';
import 'nodejs-dashboard';
import { CONFIG } from './config/config';
import { startBot } from './helpers';
import configMiddleware from './middlewares/appMiddleware';
import configRoutes from './routes';

export const main = async () => {
  const app: Application = express();

  configMiddleware(app); // middlewares
  configRoutes(app); // routes

  // middleware for invalid routes
  app.use((req, res, next) => {
    return res.json({
      success: false,
      message: 'Route invalid',
    });
  });

  app.listen(CONFIG.PORT, () => {
    console.log(`server starting on port ${CONFIG.PORT}`);
    startBot();
    //priceMonitor('ETHUSDT');
  });
};
