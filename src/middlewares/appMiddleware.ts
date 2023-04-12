import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

export default (app: Application) => {
  app.use(
    express.json({
      type: 'application/json',
    })
  );
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(morgan('dev'));
};
