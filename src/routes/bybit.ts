import { Router } from 'express';
import { placeOrder } from '../controllers/bybitController';

// router
const bytbitRouter = Router();

bytbitRouter.post('/place-order', placeOrder);

export default bytbitRouter;
