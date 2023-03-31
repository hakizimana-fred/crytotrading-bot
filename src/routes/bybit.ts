import { Router } from 'express';
import { placeOrder, viewOrders } from '../controllers/bybitController';

// router
const bytbitRouter = Router();

bytbitRouter.post('/place-order', placeOrder);
bytbitRouter.get('/view-orders', viewOrders);

export default bytbitRouter;
