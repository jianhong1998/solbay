import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { USDC_MINT_PUBLICK_KEY_DEVNET } from 'src/common/constants/public-key.constant';
import { UuidHelper } from 'src/common/helpers/uuid.helper';
import { OrderOnChainDataHelperUtil } from 'src/on-chain-program/utils/order-on-chain-data-helper.util';
import { ProductModel } from 'src/product/models/product.model';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';
import { UserModel } from 'src/user/models/user.model';

import { OrderStatus } from '../enums/order-status.enum';
import { OrderModel } from '../models/order.model';

@Injectable()
export class OrderHelperUtil {
  constructor() {}

  public calculateTotalPrice(params: {
    product: ProductModel;
    quantity: number;
  }): number {
    const { product, quantity } = params;

    const unitPrice = product.priceInMicroUsdc;
    return unitPrice * quantity;
  }

  public async getOrderStatus(order: OrderModel): Promise<OrderStatus> {
    const { onChainDataPubkey } = order;

    if (!onChainDataPubkey) return OrderStatus.PENDING_PAYMENT;

    // TODO: Return correct order status based on on-chain data
    const _orderData = await OrderOnChainDataHelperUtil.getOrderData(
      order.uuid,
    );

    return OrderStatus.PENDING_SELLER_SHIP_OUT;
  }

  public async generatePaymentTransaction(
    order: OrderModel,
    buyer: UserModel,
    seller: UserModel,
  ) {
    const program = ConnectionUtil.getProgram();
    const buyerPublicKey = new PublicKey(buyer.publicKey);
    const sellerPublicKey = new PublicKey(seller.publicKey);
    const amount = new BN(0);
    const orderId = order.uuid;
    const orderIdBytes = Array.from(UuidHelper.convertUuidToBytes(orderId));

    const instruction = await program.methods
      .purchase(
        orderIdBytes,
        'SOLB',
        new BN(order.totalAmountInMicroUsdc),
        amount,
        '',
      )
      .accounts({
        buyer: buyerPublicKey,
        mint: USDC_MINT_PUBLICK_KEY_DEVNET,
        seller: sellerPublicKey,
      })
      .instruction();

    const transaction = TransactionUtil.createTransaction({
      instructions: [instruction],
      payerPublicKey: buyerPublicKey,
    });

    return transaction;
  }
}
