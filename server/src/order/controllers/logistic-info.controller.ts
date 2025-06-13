import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { User } from 'src/common/decorators';
import { UserModel } from 'src/user/models/user.model';
import { EntityManager } from 'typeorm';

import { GetOrderLogisticInfoResDTO } from '../dtos/logistic-info/get-order-logistic-info.dto';
import { OrderLogisticInfoService } from '../services/order-logistic-info.service';

@Controller('/order/:orderId/logistic-info')
export class LogisticInfoController {
  constructor(
    private readonly orderLogisticInfoService: OrderLogisticInfoService,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  @Get('/')
  public async getOrderLogisticInfo(
    @User() user: UserModel,
    @Param('orderId') orderId: UUID,
  ): Promise<GetOrderLogisticInfoResDTO> {
    const orderLogisticInfo =
      await this.orderLogisticInfoService.getLogisticInfoByOrderId({
        orderId,
        user,
        entityManager: this.entityManager,
      });

    if (!orderLogisticInfo)
      throw new NotFoundException('Logistic info not found');

    return new GetOrderLogisticInfoResDTO(orderLogisticInfo);
  }
}
