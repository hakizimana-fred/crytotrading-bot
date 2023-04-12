import { LinearOrder, NewLinearOrder, WalletBalances } from 'bybit-api';
import { Context, Markup, Telegraf } from 'telegraf';
import { CONFIG } from '../config/config';
import { bybit } from '../exchange/bybbit';
import { validSymbol } from '../schemas';

export const bot = new Telegraf(CONFIG.TELEGRAM_KEY);

// start bot
bot.start((ctx: any) => {
  ctx.replyWithDice();
  ctx.reply(
    `Welcome ${ctx.message.from.first_name} Lets start trading!:\n
Buy: /placeorder\n`
  );
});

// place order
bot.command('placeorder', (ctx) => {
  ctx.reply(
    'Would you like to Buy or Sell',
    Markup.inlineKeyboard([
      Markup.button.callback('Buy', 'buy'),
      Markup.button.callback('Sell', 'sell'),
    ])
  );
});

// view orders
bot.command('vieworders', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);

  if (args.length > 1 || !args) {
    ctx.reply('Invalid input, please input a valid input and try again');
    return;
  }
  const str_arg = args.toString();
  const isValidArg = validSymbol(str_arg);
  if (isValidArg.symbol) {
    ctx.reply(isValidArg.symbol);
    return;
  }
  const { ret_code, ret_msg, result } = await bybit.viewOrders({
    symbol: str_arg,
  });

  if (ret_code === 0 && ret_msg === 'OK' && result) {
    const { data: orders } = result;

    let reply = '';
    for (const order of orders) {
      const { symbol: sy, side, order_type, price, qty } = order;

      reply += `
        symbol: ${sy}\n
        side: ${side}\n
        order_type: ${order_type}\n
        price: ${price}\n
        quantity: ${qty}\n
      `;
    }

    ctx.reply(reply);
  }
});

bot.action('buy', async (ctx) => {
  getOrderType(ctx);
});

bot.action('sell', async (ctx) => {
  sellOrder(ctx);
  // try {
  //   const _params: NewLinearOrder = {
  //     symbol: 'ETHUSDT',
  //     side: 'Sell',
  //     qty: 0.01,
  //     order_type: 'Market',
  //     time_in_force: 'GoodTillCancel',
  //     reduce_only: false,
  //     close_on_trigger: false,
  //   };
  //   const order = (await bybit.placeActiveOrder(_params)) as LinearOrder;
  //   if (order) {
  //     ctx.reply('You successfully placed a sell order');
  //   } else {
  //     ctx.reply('Something went wrong while placing order!');
  //   }
  // } catch (e) {
  //   throw new Error('Someting went wrong');
  // }
});

const getOrderType = (ctx: Context) => {
  ctx.reply(
    'Please select Order Type',
    Markup.inlineKeyboard([
      Markup.button.callback('Market', 'market'),
      Markup.button.callback('Limit', 'limit'),
    ])
  );

  bot.action('market', (ctx) => {
    ctx.reply(
      'you selected market order, reply with A pair and quantity Format in this format\n /marketorder PAIR Quantity example(ETHUSDT 0.5) \n'
    );
    marketOrder();
  });

  bot.action('limit', (ctx) => {
    ctx.reply(
      'your limit order will be a chace order, reply with A pair and quantity Format in this format\n /limitorder PAIR Quantity Price example(/limitorder ETHUSDT 0.5 1786) \n'
    );
    limitOrder();
  });
};

const marketOrder = () => {
  bot.command('marketorder', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);

    if (args.length < 2 || args.length > 2) {
      ctx.reply('Invalid input arguments!');
      return;
    }
    const [symbol, qty] = args;
    const isValidSymbol = validSymbol(symbol);
    const qtyRgx = /^\d+(\.\d+)?$/;

    if (isValidSymbol.symbol) {
      ctx.reply(isValidSymbol.symbol);
      return;
    }
    if (!qtyRgx.test(qty)) {
      ctx.reply('Invalid quantity');
      return;
    }

    try {
      const _params: NewLinearOrder = {
        symbol,
        side: 'Buy',
        qty: parseFloat(qty),
        order_type: 'Market',
        time_in_force: 'GoodTillCancel',
        reduce_only: false,
        close_on_trigger: false,
      };
      const order = (await bybit.placeActiveOrder(_params)) as LinearOrder;
      if (order) {
        ctx.reply('You successfully placed a buy order');
      } else {
        ctx.reply('Something went wrong while placing order!');
      }
    } catch (e) {
      throw new Error('Someting went wrong');
    }
  });
};

// limit order
// this type of order will be a chase order
const limitOrder = () => {
  bot.command('limitorder', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const [symbol, qty, price] = args;

    const isValidSymbol = validSymbol(symbol);
    const qtyRgxOrPriceRgx = /^\d+(\.\d+)?$/;

    if (isValidSymbol.symbol) {
      ctx.reply(isValidSymbol.symbol);
      return;
    }
    if (!qtyRgxOrPriceRgx.test(qty)) {
      ctx.reply('Invalid quantity input');
      return;
    }

    if (!qtyRgxOrPriceRgx.test(price)) {
      ctx.reply('Invalid price input');
      return;
    }
    const _params = {
      side: 'Buy',
      symbol,
      order_type: 'Limit',
      qty: parseFloat(qty),
      time_in_force: 'GoodTillCancel',
      reduce_only: false,
      close_on_trigger: false,
      price: parseFloat(price),
    };

    try {
      const response = await fetch(`http://localhost:5000/api/v1/place-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_params),
      });
      const data = await response.json();
      ctx.reply(data.message);
    } catch (e) {
      console.log(e, 'error');
      ctx.reply(e.message);
    }
  });
};

// View balances
bot.command('coinbalance', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const [coin] = args;
  if (!coin) {
    ctx.reply('Coin is required');
    return;
  }

  try {
    const balance = (await bybit.getWalletBallance({ coin })) as WalletBalances;

    const coin_balance = balance[coin]?.available_balance as any;
    console.log(coin_balance, 'just coin');

    ctx.reply(` your available balance is ${coin_balance} `);
  } catch (e) {
    ctx.reply(e.message);
  }
});

// cancel orders
bot.command('cancelorders', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  const [symbol] = args;
  if (!symbol) {
    ctx.reply('Symbol is required');
    return;
  }
  const isValidSymbol = validSymbol(symbol);
  if (Object.keys(isValidSymbol).length > 0) {
    ctx.reply(isValidSymbol.symbol);
    return;
  }
  try {
    await bybit.cancelOrders({ symbol });
    ctx.reply(`Canceled orders successfully!`);
  } catch (e) {
    console.log(e.message);
    ctx.reply(`something went wrong while canceling orders ${e.message}`);
  }
});

const sellOrder = (ctx: any) => {
  ctx.reply(
    'you selected market order, reply with A pair and quantity Format in this format\n /sellorder PAIR Quantity example(ETHUSDT 0.5) \n'
  );
  bot.command('sellorder', async (context) => {
    const args = context.message.text.split(' ').slice(1);
    const [symbol, qty] = args;

    const isValidSymbol = validSymbol(symbol);
    const qtyRgx = /^\d+(\.\d+)?$/;

    if (isValidSymbol.symbol) {
      ctx.reply(isValidSymbol.symbol);
      return;
    }
    if (!qtyRgx.test(qty)) {
      ctx.reply('Invalid quantity');
      return;
    }

    const _params = {
      side: 'Sell',
      symbol,
      order_type: 'Market',
      qty: parseFloat(qty),
      time_in_force: 'GoodTillCancel',
      reduce_only: true,
      close_on_trigger: false,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/v1/place-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_params),
      });
      const data = await response.json();
      context.reply('Successfully sold');
    } catch (e) {
      console.log(e, 'error');
      context.reply('Successfully sold');
    }
  });
};
