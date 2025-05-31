import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { BN } from 'bn.js';
import { UUID } from 'crypto';
import { addDays } from 'date-fns';
import { UuidHelper } from 'src/common/helpers/uuid.helper';
import { UsdcHelper } from 'src/solana-connection/helpers/usdc.helper';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';
import { UserModel } from 'src/user/models/user.model';
import { EntityManager, In, IsNull } from 'typeorm';

import { OrderDBUtil } from '../utils/order-db.util';

@Injectable()
export class PaymentService {
  constructor(
    private readonly orderDBUtil: OrderDBUtil,
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

    if (!orders.length) return null;

    const mint = UsdcHelper.getUsdcMint();

    const instructionPromises = orders.map((order) => {
      const uuidBytes = UuidHelper.convertUuidToBytes(order.uuid);
      const amount = new BN(order.totalAmountInMicroUsdc);

      const sellerTimeoutDate = addDays(new Date(), 7);
      const sellerTimeout = new BN(sellerTimeoutDate.getTime());
      const sellerPublicKey = new PublicKey(
        order.product?.seller?.user?.publicKey ?? '',
      );

      return program.methods
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
}

export type IGeneratePaymentTransactionReturnType = {
  transaction: VersionedTransaction;
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number };
};
