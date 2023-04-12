import { Router } from 'express';
import {
  cancelOrders,
  placeOrder,
  prices,
  viewOrders,
  walletBalance,
} from '../controllers/bybit.controller';

// router
const bytbitRouter = Router();

bytbitRouter.post('/place-order', placeOrder);
bytbitRouter.get('/view-orders', viewOrders);
bytbitRouter.get('/pair-price', prices);
bytbitRouter.post('/cancel-orders', cancelOrders);
bytbitRouter.get('/wallet-balance', walletBalance);

export default bytbitRouter;
