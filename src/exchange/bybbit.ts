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
}

export const bybit = new ByBitExchange({
  key: CONFIG.API_KEY,
  secret: CONFIG.API_SECRET,
  testnet: CONFIG.TEST_NET,
  url: CONFIG.URL,
});
