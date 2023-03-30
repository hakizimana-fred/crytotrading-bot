import { Request, Response } from 'express';
import { bybit } from '../exchange/bybbit';

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { side, price, symbol, order_type, qty } = req.body;
    const myActiveOrder = await bybit.placeActiveOrder({
      side,
      symbol,
      order_type,
      qty,
      time_in_force: 'GoodTillCancel',
      reduce_only: false,
      close_on_trigger: false,
      price,
    });

    return res.status(200).json({ success: true, data: myActiveOrder });
  } catch (e) {
    return res.status(400).json({
      success: true,
      error: e.message,
      message: 'Trade did not go through',
    });
  }
};
