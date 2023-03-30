import { LinearOrder, NewLinearOrder } from 'bybit-api';
import { Context, Markup, Telegraf } from 'telegraf';
import { CONFIG } from '../config/config';
import { bybit } from '../exchange/bybbit';

export const bot = new Telegraf(CONFIG.TELEGRAM_KEY);

bot.start((ctx: any) => {
  ctx.replyWithDice();
  ctx.reply(
    `Welcome ${ctx.message.from.first_name} lets Buy USDT\n Use thisfor guidence:\n
Buy: /placeorder\n`
  );
});

bot.command('placeorder', (ctx) => {
  ctx.reply(
    'Would you like to Buy or Sell',
    Markup.inlineKeyboard([
      Markup.button.callback('Buy', 'buy'),
      Markup.button.callback('Sell', 'sell'),
    ])
  );
});

bot.action('buy', async (ctx) => {
  getOrderType(ctx);
});

bot.action('sell', async (ctx) => {
  try {
    const _params: NewLinearOrder = {
      symbol: 'ETHUSDT',
      side: 'Sell',
      qty: 0.01,
      order_type: 'Market',
      time_in_force: 'GoodTillCancel',
      reduce_only: false,
      close_on_trigger: false,
    };
    const order = (await bybit.placeActiveOrder(_params)) as LinearOrder;
    if (order) {
      ctx.reply('You successfully placed a sell order');
    } else {
      ctx.reply('Something went wrong while placing order!');
    }
  } catch (e) {
    throw new Error('Someting went wrong');
  }
});

// bot.command('search', (ctx) => {
//   const args = ctx.message.text.split(' ').slice(1); // extract arguments after the command
//   console.log(args);
// });

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
      'you selected limit market order, reply with A pair and quantity Format in this format\n /limitorder PAIR Quantity Price example(/limitorder ETHUSDT 0.5 1786) \n'
    );
    limitOrder();
  });
};

const marketOrder = () => {
  bot.command('marketorder', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length > 2) {
      ctx.reply("You input exceeds what's expeccted");
      return;
    }
    const [symbol, qty] = args;
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

const limitOrder = () => {
  bot.command('limitorder', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length > 3) {
      ctx.reply("You input exceeds what's expeccted");
      return;
    }
    const [symbol, qty, price] = args;
    try {
      const _params: NewLinearOrder = {
        symbol,
        side: 'Buy',
        qty: parseFloat(qty),
        order_type: 'Limit',
        time_in_force: 'GoodTillCancel',
        reduce_only: false,
        close_on_trigger: false,
        price: parseFloat(price),
      };
      const order = (await bybit.placeActiveOrder(_params)) as LinearOrder;
      if (order) {
        ctx.reply('You successfully placed a Sell order');
      } else {
        ctx.reply('Something went wrong while placing order!');
      }
    } catch (e) {
      throw new Error('Someting went wrong');
    }
  });
};
