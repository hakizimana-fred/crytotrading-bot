import { LinearOrder, NewLinearOrder } from 'bybit-api';
import { Markup, Telegraf } from 'telegraf';
import { CONFIG } from '../config/config';
import { bybit } from '../exchange/bybbit';

export const bot = new Telegraf(CONFIG.TELEGRAM_KEY);

type MyResponse = {
  ret_code: number;
  ret_message: string;
  result: object;
};

bot.start((ctx: any) => {
  ctx.replyWithDice();
  ctx.reply(
    `Welcome ${ctx.message.from.first_name} lets Buy USDT\n Use thisfor guidence:\n
Buy: /placeorder\n`
  );
});

bot.command('placeorder', (ctx) => {
  ctx.reply(
    'Please select Order Type',
    Markup.inlineKeyboard([
      Markup.button.callback('Market', 'market'),
      Markup.button.callback('Limit', 'limit'),
    ])
  );
});

bot.action('market', async (ctx) => {
  try {
    const _params: NewLinearOrder = {
      symbol: 'ETHUSDT',
      side: 'Buy',
      qty: 0.01,
      order_type: 'Market',
      time_in_force: 'GoodTillCancel',
      reduce_only: false,
      close_on_trigger: false,
    };
    const order = (await bybit.placeActiveOrder(_params)) as LinearOrder;
    if (order) {
      ctx.reply('You successfully placed an order');
    } else {
      ctx.reply('Something went wrong while placing order!');
    }
  } catch (e) {
    throw new Error('Someting went wrong');
  }
});
