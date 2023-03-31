import {
  CoinParam,
  LinearClient,
  LinearOrder,
  NewLinearOrder,
  SymbolParam,
  WalletBalances,
} from 'bybit-api';
import { CONFIG } from '../config/config';

class ByBitExchange {
  private linear: LinearClient;

  constructor(params: {
    key: string;
    secret: string;
    testnet: boolean;
    url: string;
  }) {
    this.linear = new LinearClient(params);
  }

  async getOrderBook(params: SymbolParam): Promise<any[] | null> {
    const order = await this.linear.getOrderBook({ symbol: params.symbol });
    if (order) {
      return [order];
    }
    return null;
  }

  async placeActiveOrder(params: NewLinearOrder): Promise<LinearOrder | null> {
    const order = await this.linear.placeActiveOrder(params);
    const { ret_code, ret_msg, result } = order;
    if (ret_code === 0 && ret_msg === 'OK' && result) {
      if (Object.keys(result).length > 0) {
        return {
          ...result,
        };
      }
    }
    return null;
  }

  async getWalletBallance(params: CoinParam): Promise<WalletBalances | null> {
    const myEth = await this.linear.getWalletBalance(params);

    console.log(myEth);

    return null;
  }

  async getMarketPrice() {}
}

export const bybit = new ByBitExchange({
  key: CONFIG.API_KEY,
  secret: CONFIG.API_SECRET,
  testnet: CONFIG.TEST_NET,
  url: CONFIG.URL,
});
