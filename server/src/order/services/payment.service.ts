import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { BN } from 'bn.js';
import { UUID } from 'crypto';
import { addDays } from 'date-fns';
import { UuidHelper } from 'src/common/helpers/uuid.helper';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { OrderOnChainDataFetchingUtil } from 'src/on-chain-program/utils/order-on-chain-data-fetching.util';
import { OrderOnChainDataHelperUtil } from 'src/on-chain-program/utils/order-on-chain-data-helper.util';
import { UsdcHelper } from 'src/solana-connection/helpers/usdc.helper';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';
import { UserModel } from 'src/user/models/user.model';
import { SellerDBUtil } from 'src/user/utils/sellerDB.util';
import { EntityManager, In, IsNull } from 'typeorm';

import { OrderDBUtil } from '../utils/order-db.util';
import { OrderHelperUtil } from '../utils/order-helper.util';
import { TempOrderDBUtil } from '../utils/temp-order-db.util';

@Injectable()
export class PaymentService {
  constructor(
    private readonly orderDBUtil: OrderDBUtil,
    private readonly sellerDBUtil: SellerDBUtil,
    private readonly tempOrderDBUtil: TempOrderDBUtil,
    private readonly orderHelper: OrderHelperUtil,
    private readonly loggerUtil: LoggerUtil,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async generatePaymentTransaction(params: {
    orderIds: UUID[];
    buyer: UserModel;
    entityManager?: EntityManager;
  }): Promise<IGeneratePaymentTransactionReturnType | null> {
    const { orderIds, buyer } = params;
    const entityManager = params.entityManager ?? this.entityManager;
    const program = ConnectionUtil.getProgram();

    const buyerPublicKey = new PublicKey(buyer.publicKey);

    const orders = await this.orderDBUtil.getAll({
      entityManager,
      criterial: {
        uuid: In(orderIds),
        onChainDataPubkey: IsNull(),
      },
      relation: {
        product: {
          seller: {
            user: true,
          },
        },
      },
    });

    if (!orders.length)
      throw new NotFoundException('No order is pending payment');

    const sellerIds = Array.from(
      new Set(
        orders
          .map((order) => order.product?.seller?.uuid)
          .filter((id) => typeof id === 'string'),
      ),
    );
    const sellers = await this.sellerDBUtil.getAll({
      criterial: {
        uuid: In(sellerIds),
      },
      entityManager,
      relation: {
        user: true,
      },
    });

    const sellerMap = new Map(sellers.map((seller) => [seller.uuid, seller]));

    if (!orders.length) return null;

    const mint = UsdcHelper.getUsdcMintPublicKey();

    const instructionPromises = orders.map(async (order) => {
      const uuidBytes = UuidHelper.convertUuidToBytes(order.uuid);
      const amount = new BN(order.totalAmountInMicroUsdc);

      const sellerTimeoutDate = addDays(new Date(), 7);
      const sellerTimeout = new BN(sellerTimeoutDate.getTime());

      const seller = sellerMap.get(order.product?.seller?.uuid ?? ('' as UUID));

      if (!seller) throw new Error('seller not found in the sellerMap');
      if (!seller.user) throw new Error('user is not found in seller model');

      const sellerPublicKey = new PublicKey(seller.user.publicKey);

      return await program.methods
        .purchase(Array.from(uuidBytes), 'SOLB', amount, sellerTimeout, '')
        .accounts({
          mint,
          seller: sellerPublicKey,
          buyer: buyerPublicKey,
        })
        .instruction();
    });

    const instructions = await Promise.all(instructionPromises);

    const { transaction, latestBlockhash } =
      await TransactionUtil.createTransaction({
        instructions,
        payerPublicKey: buyerPublicKey,
      });

    return { transaction, latestBlockhash };
  }

  public async updateOrdersPaymentStatus(params: {
    orderIds: UUID[];
    entityManager?: EntityManager;
  }) {
    const { orderIds } = params;
    const entityManager = params.entityManager ?? this.entityManager;
    const logger = this.loggerUtil.createLogger('UpdateOrderPaymentStatus');

    const paidOrderIds = await entityManager.transaction(async (manager) => {
      const orders = await this.orderDBUtil.getAll({
        entityManager: manager,
        criterial: {
          uuid: In(orderIds),
          onChainDataPubkey: IsNull(),
        },
      });
      const tempOrders = await this.tempOrderDBUtil.getAll({
        entityManager: manager,
        criterial: {
          order: {
            uuid: In(orderIds),
          },
        },
      });

      if (!orders.length)
        throw new NotFoundException('No order is pending payment');

      /* Get Onchain order data */

      const promises = orders.map<Promise<[UUID, PublicKey] | null>>(
        async (order) => {
          const orderPublicKey =
            OrderOnChainDataHelperUtil.generateOrderPdaPublicKey(order.uuid);
          const orderOnchainData =
            await OrderOnChainDataFetchingUtil.getOrderByOrderPublicKey(
              orderPublicKey,
            );

          if (!orderOnchainData) return null;

          return [order.uuid, orderPublicKey];
        },
      );

      const paidOrderPublicKeyMap = new Map<UUID, PublicKey>(
        (await Promise.all(promises)).filter((pair) => !!pair),
      );

      /*
        Find out what orders and tempOrders to update.
        Should only update order with onchain data
      */

      if (!paidOrderPublicKeyMap.size) {
        logger.log('No order to update.');
        return [];
      }

      const paidTempOrderIds = tempOrders
        .filter((tempOrder) => paidOrderPublicKeyMap.has(tempOrder.order.uuid))
        .map((tempOrder) => tempOrder.uuid);

      const paidOrders = orders.filter((order) =>
        paidOrderPublicKeyMap.has(order.uuid),
      );

      /* Update order status */

      paidOrders.forEach((order) => {
        const publicKey = paidOrderPublicKeyMap.get(order.uuid);
        if (!publicKey)
          throw new Error('Order public key cannot found in the map');
        order.onChainDataPubkey = publicKey.toBase58();
      });

      await this.orderDBUtil.saveUpdate({
        dataArray: paidOrders,
        entityManager: manager,
      });

      await this.tempOrderDBUtil.delete({
        criterial: {
          uuid: In(paidTempOrderIds),
        },
        entityManager: manager,
      });

      const paidOrderIds = paidOrders.map((order) => order.uuid);

      logger.log(`Orders status updated: ${paidOrderIds.join(', ')}`);

      return paidOrderIds;
    });

    return paidOrderIds;
  }
}

export type IGeneratePaymentTransactionReturnType = {
  transaction: VersionedTransaction;
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number };
};
