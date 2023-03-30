import { Application } from 'express';
import bytbitRouter from './bybit';

export default (app: Application) => {
  app.use('/api/v1/', bytbitRouter);
};
