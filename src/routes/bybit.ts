import { Router } from 'express';
import {
  cancelOrders,
  placeOrder,
  viewOrders,
  walletBalance,
} from '../controllers/bybitController';

// router
const bytbitRouter = Router();

bytbitRouter.post('/place-order', placeOrder);
bytbitRouter.get('/view-orders', viewOrders);
bytbitRouter.post('/cancel-orders', cancelOrders);
bytbitRouter.get('/wallet-balance', walletBalance);

export default bytbitRouter;
