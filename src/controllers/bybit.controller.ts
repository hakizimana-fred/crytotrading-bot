import { Request, Response } from 'express';
import { bybit } from '../exchange/bybbit';
import { orderSchema, validSymbol } from '../schemas';

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { side, price, symbol, order_type, qty } = orderSchema.parse(
      req.body
    );

    const myActiveOrder = await bybit.placeActiveOrder({
      side,
      symbol,
      order_type,
      qty,
      time_in_force: 'GoodTillCancel',
      reduce_only: side === 'Sell' ? true : false,
      close_on_trigger: false,
      price: price ? price : undefined,
    });

    if (order_type === 'Market')
      return res.status(200).json({ success: true, data: myActiveOrder });

    // call our chase order method

    const orderId = myActiveOrder?.order_id;
    if (orderId !== undefined) {
      await bybit.chaseOrder({
        side,
        symbol,
        orderId,
      });
      return res.json({
        status: true,
        message: 'Your order was a success',
      });
    }

    return res.json('Order Id was needed');
  } catch (err) {
    const error: any = {
      message: 'Validation failed',
      errors: {},
    };

    err.errors.forEach((e: any) => {
      const field = e.path.join('.');
      error.errors[field] = e.message;
    });

    return res.status(400).send(error);
  }
};

export const viewOrders = async (req: Request, res: Response) => {
  const { symbol } = req.body;
  try {
    const errors = validSymbol(symbol);
    if (Object.keys(errors).length > 0)
      return res.status(400).json({ success: false, errors: errors.symbol });
    const orders = await bybit.viewOrders({ symbol });
    return res
      .status(200)
      .json({ success: true, message: 'View orders', data: orders });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

export const cancelOrders = async (req: Request, res: Response) => {
  const { symbol } = req.body;
  try {
    const errors = validSymbol(symbol);
    if (Object.keys(errors).length > 0)
      return res.status(400).json({ success: false, errors: errors.symbol });
    await bybit.cancelOrders({ symbol });
    return res.status(200).json({
      success: true,
      message: 'Successfully canceled orders',
      data: {},
    });
  } catch (e) {
    return res.status(400).json({
      success: true,
      error: e.message,
      message: 'Could not cancel orders',
    });
  }
};

export const walletBalance = async (req: Request, res: Response) => {
  const { symbol } = req.body;

  try {
    if (!symbol)
      return res
        .status(400)
        .json({ success: false, errors: 'Symbol is required' });

    if (!symbol.match(/^[A-Z]{3,6}$/)) {
      return res
        .status(400)
        .json({ success: false, errors: 'Symbol might be invalid' });
    }
    const balance = await bybit.getWalletBallance(symbol);
    const data = {};
    for (const key in balance) {
      if (key === symbol) {
        Object.assign(data, balance[key]);
      }
    }
    if (Object.keys(data).length > 0) {
      return res
        .status(200)
        .json({ success: true, message: 'Fetched balance', data });
    } else {
      return res
        .status(200)
        .json({ success: true, message: 'Nothing was found', data: {} });
    }
  } catch (e) {
    return res.status(400).json({
      success: true,
      error: e.message,
      message: 'something went wrong',
    });
  }
};

export const prices = async (req: Request, res: Response) => {
  const { symbol } = req.body;
  try {
    const errors = validSymbol(symbol);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors: errors.symbol });
    }

    const { result } = await bybit.getPrice({ symbol });
    let lastPrice;

    for (const price of result) {
      const { last_price } = price;
      lastPrice = last_price;
    }

    return res.status(200).json({
      success: true,
      data: lastPrice,
      message: 'Fetched price successfully',
    });
  } catch (e) {
    return res.status(400).json({
      success: true,
      error: e.message,
      message: 'something went wrong',
    });
  }
};
