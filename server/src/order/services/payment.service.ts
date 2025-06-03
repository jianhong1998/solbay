import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { BN } from 'bn.js';
import { UUID } from 'crypto';
import { addDays } from 'date-fns';
import { UuidHelper } from 'src/common/helpers/uuid.helper';
import { OrderOnChainDataHelperUtil } from 'src/on-chain-program/utils/order-on-chain-data-helper.util';
import { UsdcHelper } from 'src/solana-connection/helpers/usdc.helper';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';
import { UserModel } from 'src/user/models/user.model';
import { SellerDBUtil } from 'src/user/utils/sellerDB.util';
import { EntityManager, In, IsNull } from 'typeorm';

import { OrderStatus } from '../enums/order-status.enum';
import { OrderDBUtil } from '../utils/order-db.util';
import { OrderHelperUtil } from '../utils/order-helper.util';

@Injectable()
export class PaymentService {
  constructor(
    private readonly orderDBUtil: OrderDBUtil,
    private readonly orderHelper: OrderHelperUtil,
    private readonly sellerDBUtil: SellerDBUtil,
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

    const orders = await this.orderDBUtil.getAll({
      entityManager,
      criterial: {
        uuid: In(orderIds),
        onChainDataPubkey: IsNull(),
      },
    });

    if (!orders.length)
      throw new NotFoundException('No order is pending payment');

    /* Get status of orders */

    const promises = orders.map(async (order) => {
      const orderStatus = await this.orderHelper.getOrderStatus(order);

      return [order.uuid, orderStatus];
    }) as Promise<[UUID, OrderStatus]>[];

    const orderStatusMap = new Map(await Promise.all(promises));

    /* Update orders */
    orders.forEach((order) => {
      const status = orderStatusMap.get(order.uuid);

      if (!status || status === OrderStatus.PENDING_PAYMENT) return;

      const onChainDataPublicKey =
        OrderOnChainDataHelperUtil.generateOrderPdaPublicKey(order.uuid);

      order.onChainDataPubkey = onChainDataPublicKey.toBase58();
    });

    await this.orderDBUtil.saveUpdate({
      orders,
      entityManager,
    });
  }
}

export type IGeneratePaymentTransactionReturnType = {
  transaction: VersionedTransaction;
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number };
};
