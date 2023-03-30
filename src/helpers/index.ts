import { bot } from '../bot/bot';

export const startBot = async () => {
  console.log(`---`.repeat(10));
  console.log(`starting bot  🤖 `);
  console.log(`---`.repeat(10));
  bot
    .launch()
    .then(() => {})
    .catch(() => {});
};
