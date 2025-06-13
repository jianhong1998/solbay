import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { UserModel } from 'src/user/models/user.model';
import { SellerService } from 'src/user/services/seller.service';
import { EntityManager } from 'typeorm';

import { LogisticInfoModel } from '../models/logistic-info.model';
import { OrderWithOnchainData } from '../types/order-with-onchain-data.type';
import { LogisticInfoDBUtil } from '../utils/logistic-info-db.util';
import { OrderDBUtil } from '../utils/order-db.util';
import { TempOrderDBUtil } from '../utils/temp-order-db.util';

@Injectable()
export class OrderLogisticInfoService {
  constructor(
    private readonly tempOrderDBUtil: TempOrderDBUtil,
    private readonly orderDBUtil: OrderDBUtil,
    private readonly logisticInfoDBUtil: LogisticInfoDBUtil,
    private readonly sellerService: SellerService,

    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  /**
   * Get logistic info for an order by order ID.
   *
   * @throw ForbiddenException If user is not the buyer or the product seller.
   *
   * @return Null if user is seller and order is not paid yet.
   */
  public async getLogisticInfoByOrderId(params: {
    orderId: UUID;
    user: UserModel;
    entityManager?: EntityManager;
  }): Promise<LogisticInfoModel | null> {
    const { orderId, user } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    return await entityManager.transaction(async (manager) => {
      const order = await this.orderDBUtil.getOne({
        criterial: {
          uuid: orderId,
        },
        relation: {
          logisticInfo: true,
          product: {
            seller: true,
          },
        },
        entityManager: manager,
      });

      if (!order || !order.logisticInfo) return null;

      /* Check if user is buyer */
      const orderWithOnchainData = await OrderWithOnchainData.new(order);

      let isBuyer: boolean = false;

      if (orderWithOnchainData.orderOnchainData) {
        const buyerPublicKeyString =
          orderWithOnchainData.orderOnchainData.buyerPubkey.toBase58();

        isBuyer = user.publicKey === buyerPublicKeyString;
      } else {
        /* Means order is temp order and not paid yet */
        isBuyer = await this.tempOrderDBUtil.has({
          criterial: {
            buyer: {
              uuid: user.uuid,
            },
            order: {
              uuid: orderId,
            },
          },
          entityManager: manager,
        });
      }

      /* Handle user is buyer */
      if (isBuyer) return order.logisticInfo;

      /* Check if user is seller */
      let isSeller: boolean = false;

      if (orderWithOnchainData.orderOnchainData) {
        const sellerPublicKeyString =
          orderWithOnchainData.orderOnchainData.sellerPubkey.toBase58();
        isSeller = sellerPublicKeyString === user.publicKey;
      } else {
        const sellerId = orderWithOnchainData.product?.seller?.uuid;

        if (!sellerId) throw new Error('sellerId is not fetched');

        const seller = await this.sellerService.getSellerById({
          sellerId,
          withUser: true,
          entityManager: manager,
        });

        if (!seller)
          throw new Error(`Seller is not found in order (${orderId})`);
        if (!seller.user) throw new Error(`User is not fetched in seller`);

        isSeller = seller.user.uuid === user.uuid;
      }

      /* Handle user is not seller */
      if (!isSeller)
        throw new ForbiddenException(`You are not allowed to view this info.`);

      /* Handle user is seller */

      /* Seller can only get paid order logistic info */
      if (!orderWithOnchainData.orderOnchainData) {
        return null;
      }

      return order.logisticInfo;
    });
  }
}
