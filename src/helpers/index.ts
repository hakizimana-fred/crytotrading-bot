import { CronJob } from 'cron';
import { bot } from '../bot/bot';
import { bybit } from '../exchange/bybbit';

export const startBot = async () => {
  console.log(`---`.repeat(10));
  console.log(`starting bot  🤖 `);
  console.log(`---`.repeat(10));
  bot
    .launch()
    .then(() => {})
    .catch(() => {});
};

export const priceMonitor = (symbol: string) => {
  let previousLastPrice: any = null;
  let currentLastPrice: any = null;
  const job = new CronJob('*/10 * * * * *', async () => {
    const { result } = await bybit.getPrice({ symbol });

    if (result) {
      for (let i = 0; i < result.length; i++) {
        if (previousLastPrice == null) {
          previousLastPrice = result[i].last_price;
          continue;
        }
        currentLastPrice = result[i].last_price;
        evaluatePrice(previousLastPrice, currentLastPrice);
      }
    }
  });
  job.start();
};

async function evaluatePrice(prevPrice: number, currentPrice: number) {
  const change = parseFloat((currentPrice - prevPrice).toFixed(4));

  if (change <= -0.05) {
    const bought = await bybit.placeActiveOrder({
      symbol: 'ETHUSDT',
      side: 'Buy',
      qty: 0.09,
      time_in_force: 'GoodTillCancel',
      reduce_only: false,
      close_on_trigger: false,
      order_type: 'Market',
    });
    console.log('Bought, just bought', bought);
  } else if (change >= 0.07) {
    const sold = await bybit.placeActiveOrder({
      symbol: 'ETHUSDT',
      side: 'Sell',
      qty: 0.07,
      time_in_force: 'GoodTillCancel',
      reduce_only: true,
      close_on_trigger: false,
      order_type: 'Market',
    });
    console.log('sold', sold);
  } else {
    console.log('price change', change);
  }
}

export function sleep(ms: number | undefined) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
