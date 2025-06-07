import { Program } from '@coral-xyz/anchor';
import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';
import { Solbay } from 'src/contract/src';
import { OrderOnchainData } from 'src/order/types/on-chain-data/order-on-chain-data.type';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';

import { ANCHOR_DISCRIMINATOR_SIZE } from '../constants/index.constant';

const OrderDataSize = {
  isFundReleased: 1,
  sellerPubKey: 32,
  buyerPubKey: 32,
  amount: 8,
  sellerShipOutTimeout: 8,
  fundReleaseTimeout: 8,
  tokenMintAddress: 32,
  orderId: 16,
};

type OrderDataKey = keyof typeof OrderDataSize;

export class OrderOnChainDataFetchingUtil {
  public connection: Connection;
  public program: Program<Solbay>;
  public dataOffsetMap: Map<OrderDataKey, number>;

  private static self: OrderOnChainDataFetchingUtil;

  private constructor() {
    this.connection = ConnectionUtil.getConnection();
    this.program = ConnectionUtil.getProgram();

    this.dataOffsetMap = OrderOnChainDataFetchingUtil.getDataOffsetMap();
  }

  public static async getOrderByBuyerPublicKey(
    buyerPublicKey: PublicKey,
  ): Promise<OrderOnchainData[]> {
    const self = this.getSelf();
    const { program, dataOffsetMap } = self;

    const filter: GetProgramAccountsFilter = {
      memcmp: {
        bytes: buyerPublicKey.toBase58(),
        offset: dataOffsetMap.get('buyerPubKey') ?? 0,
        encoding: 'base58',
      },
    };

    const accounts = await program.account.order.all([filter]);

    return accounts.map((acc) => {
      return new OrderOnchainData(acc.account);
    });
  }

  public static async getOrderByOrderPublicKey(
    orderPublicKey: PublicKey,
  ): Promise<OrderOnchainData | null> {
    const self = this.getSelf();
    const { program } = self;

    try {
      const account = await program.account.order.fetch(orderPublicKey);
      return new OrderOnchainData(account);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes('account does not exist')
      )
        return null;

      throw error;
    }
  }

  private static getSelf(): OrderOnChainDataFetchingUtil {
    if (!this.self) this.self = new OrderOnChainDataFetchingUtil();

    return this.self;
  }

  private static getDataOffsetMap(): Map<OrderDataKey, number> {
    const sequence: OrderDataKey[] = [
      'isFundReleased',
      'sellerPubKey',
      'buyerPubKey',
      'amount',
      'sellerShipOutTimeout',
      'fundReleaseTimeout',
      'tokenMintAddress',
      'orderId',
    ];

    const map = new Map<OrderDataKey, number>();

    sequence.forEach((key, index) => {
      if (index === 0) {
        map.set(key, ANCHOR_DISCRIMINATOR_SIZE);
        return;
      }

      const prevKey = sequence[index - 1];
      const prevOffset = map.get(prevKey)!;
      const prevDataSize = OrderDataSize[prevKey];

      map.set(key, prevOffset + prevDataSize);
    });

    return map;
  }
}
