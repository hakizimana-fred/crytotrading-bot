import {
  CoinParam,
  LinearClient,
  LinearGetOrderRequest,
  LinearOrder,
  NewLinearOrder,
  SymbolParam,
  WalletBalances,
} from 'bybit-api';
import { CONFIG } from '../config/config';
import { sleep } from '../helpers';
import { IChaseOrder } from '../types/interface';

/**
 * Represents byBitExchange
 *
 * @class
 */
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

  /**
   * @param {function(params): NewLinearOrder}
   * @return {Promise<LinearOrder | null>}
   * */
  async placeActiveOrder(params: NewLinearOrder): Promise<LinearOrder | null> {
    const order = await this.linear.placeActiveOrder(params);
    const { ret_code, ret_msg, result } = order;
    if (ret_code === 0 && ret_msg === 'OK' && result) {
      if (Object.keys(result).length > 0) {
        return {
          ...result,
        };
      }
    } else {
      console.log(order, 'full order');
    }
    return null;
  }

  /**
   * @param {function(params): CoinParam}
   * @return {Promise<WalletBalances | null>}
   * */
  async getWalletBallance(params: CoinParam): Promise<WalletBalances | null> {
    const { ret_code, ret_msg, result } = await this.linear.getWalletBalance(
      params
    );
    if (ret_code === 0 && ret_msg === 'OK' && result) {
      return result;
    }
    return null;
  }

  /**
   * @param {function(params): LinearGetOrderRequest}
   * @return {Promise<any>}
   * */
  async viewOrders(params: LinearGetOrderRequest): Promise<any> {
    const openOrders = await this.linear.getActiveOrderList(params);
    if (openOrders) return openOrders;
    return null;
  }

  /** @return {boolean} */
  async cancelOrders(params: SymbolParam): Promise<boolean> {
    const canceledorders = await this.linear.cancelAllActiveOrders(params);
    if (canceledorders) return true;
    return false;
  }

  async getPrice(params: SymbolParam): Promise<any> {
    const price = await this.linear.getTickers(params);

    return price;
  }

  async chaseOrder(params: IChaseOrder) {
    const { orderId, symbol, side } = params;
    let count: number = 0;
    const maxretries = 100;

    while (true) {
      if (!orderId) {
        console.log(`No orderId was provided`);
        break;
      }
      await sleep(10000);

      let livePrice = await this.getPrice({ symbol });
      const { result } = livePrice;
      let livePairPrice = result[0].last_price;
      livePairPrice = parseFloat(livePairPrice); // parsing prices
      if (!livePairPrice) {
        console.log('no price fetched');
        break;
      }
      livePairPrice =
        side === 'Buy' ? livePairPrice - 0.05 : livePairPrice + 0.05;

      const {
        ret_code,
        result: res,
        ret_msg,
      } = await this.linear.replaceActiveOrder({
        symbol,
        order_id: orderId,
        p_r_price: parseFloat(livePairPrice),
      });

      count += 1;
      if (Object.keys(res).length === 0 || count === maxretries) {
        break;
      }
    }
  }
}

export const bybit = new ByBitExchange({
  key: CONFIG.API_KEY,
  secret: CONFIG.API_SECRET,
  testnet: CONFIG.TEST_NET,
  url: CONFIG.URL,
});



