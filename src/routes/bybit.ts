import { Router } from "express";
import { bybit } from "../exchange/bybbit";

// router
const bytbitRouter = Router();

bytbitRouter.post("/place-order", async (req, res) => {
  const { side, price, symbol, order_type, qty } = req.body;
  const myActiveOrder = await bybit.placeActiveOrder({
    side,
    symbol,
    order_type,
    qty,
    time_in_force: "GoodTillCancel",
    reduce_only: false,
    close_on_trigger: false,
    price,
  });
  console.log('my active order', myActiveOrder)
});

export default bytbitRouter;
