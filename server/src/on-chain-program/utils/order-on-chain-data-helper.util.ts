import { Program } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { UUID } from 'crypto';
import {
  ORDER_ACCOUNT_PDA_SEED,
  SOLBAY_PLATFORM_CODE,
} from 'src/common/constants';
import { UuidHelper } from 'src/common/helpers/uuid.helper';
import { Solbay } from 'src/contract/src';
import { OrderStatus } from 'src/order/enums/order-status.enum';
import { IOnChainOrderData } from 'src/order/types/on-chain-data/order-on-chain-data.type';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';

export class OrderOnChainDataHelperUtil {
  public connection: Connection;
  public program: Program<Solbay>;

  private static self: OrderOnChainDataHelperUtil;

  private constructor() {
    this.connection = ConnectionUtil.getConnection();
    this.program = ConnectionUtil.getProgram();
  }

  public static generateOrderPdaPublicKey(orderId: UUID) {
    const seedBuffer = Buffer.from(ORDER_ACCOUNT_PDA_SEED);
    const orderIdBuffer = Buffer.from(UuidHelper.convertUuidToBytes(orderId));
    const platformCodeBuffer = Buffer.from(SOLBAY_PLATFORM_CODE);
    const program = this.getSelf().program;

    const [publicKey] = PublicKey.findProgramAddressSync(
      [seedBuffer, orderIdBuffer, platformCodeBuffer],
      program.programId,
    );

    return publicKey;
  }

  public static async getOrderData(orderId: UUID): Promise<IOnChainOrderData> {
    const self = this.getSelf();
    const program = self.program;

    const publicKey = this.generateOrderPdaPublicKey(orderId);

    const {
      amount,
      bump,
      buyerPubkey,
      fundReleaseTimeout,
      isFundReleased,
      orderId: onChainDataOrderId,
      platformCode,
      remarks,
      sellerPubkey,
      sellerShipOutTimeout,
      status,
      tokenMintAddress,
    } = await program.account.order.fetch(publicKey);

    const uuid = UuidHelper.convertBytesToUuid(onChainDataOrderId);

    const convertedStatus = this.convertOrderStatus(status);

    return {
      isFundReleased,
      sellerPubkey,
      buyerPubkey,
      amount: Number(amount),
      sellerShipOutTimeout: Number(sellerShipOutTimeout),
      fundReleaseTimeout: Number(fundReleaseTimeout),
      tokenMintAddress,
      orderId: uuid,
      platformCode,
      status: convertedStatus,
      remarks,
      bump,
    };
  }

  public static async getMultipleOrderData(
    orderIds: UUID[],
  ): Promise<IOnChainOrderData[]> {
    const self = this.getSelf();
    const program = self.program;
    const publicKeys = orderIds.map((id) => this.generateOrderPdaPublicKey(id));

    const dataArray = await program.account.order.fetchMultiple(
      publicKeys,
      'confirmed',
    );

    return dataArray
      .filter((data) => data !== null)
      .map<IOnChainOrderData>((data) => {
        const {
          amount,
          bump,
          buyerPubkey,
          fundReleaseTimeout,
          isFundReleased,
          orderId,
          platformCode,
          remarks,
          sellerPubkey,
          sellerShipOutTimeout,
          status,
          tokenMintAddress,
        } = data;

        const uuid = UuidHelper.convertBytesToUuid(orderId);

        const convertedStatus = this.convertOrderStatus(status);

        return {
          isFundReleased,
          amount: Number(amount),
          sellerShipOutTimeout: Number(sellerShipOutTimeout),
          fundReleaseTimeout: Number(fundReleaseTimeout),
          sellerPubkey,
          buyerPubkey,
          orderId: uuid,
          status: convertedStatus,
          platformCode,
          tokenMintAddress,
          remarks,
          bump,
        };
      });
  }

  public static convertOrderStatus(stringStatus: string): OrderStatus {
    /**
     * @key Value of enum OrderStatus
     * @value Key of enum OrderStatus
     */
    const statusMap = new Map<string, keyof typeof OrderStatus>(
      Object.entries(OrderStatus).map(([key, value]) => [
        value,
        key as keyof typeof OrderStatus,
      ]),
    );

    const statusKey = statusMap.get(stringStatus);

    if (!statusKey) throw new Error('Invalid order status value');

    return OrderStatus[statusKey];
  }

  private static getSelf(): OrderOnChainDataHelperUtil {
    if (!this.self) this.self = new OrderOnChainDataHelperUtil();
    return this.self;
  }
}
