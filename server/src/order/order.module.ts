import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './controllers/order.controller';
import { LogisticInfoModel } from './models/logistic-info.model';
import { LogisticTrackingInfoModel } from './models/logistic-tracking-info.model';
import { OrderModel } from './models/order.model';
import { OrderService } from './services/order.service';
import { OrderDBUtil } from './utils/order-db.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderModel,
      LogisticInfoModel,
      LogisticTrackingInfoModel,
    ]),
  ],
  providers: [OrderService, OrderDBUtil],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
