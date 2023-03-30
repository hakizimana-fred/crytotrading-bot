import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';

export default (app: Application) => {
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(compression());
};