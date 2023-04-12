import { Application } from 'express';
import bytbitRouter from './bybit.routes';

export default (app: Application) => {
  app.use('/api/v1/', bytbitRouter);
};
