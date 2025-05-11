import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { ProductModule } from 'src/product/product.module';

import { OrderController } from './controllers/order.controller';
import { LogisticInfoModel } from './models/logistic-info.model';
import { LogisticTrackingInfoModel } from './models/logistic-tracking-info.model';
import { OrderModel } from './models/order.model';
import { OrderService } from './services/order.service';
import { LogisticInfoDBUtil } from './utils/logistic-info-db.util';
import { LogisticTrackingInfoDBUtil } from './utils/logistic-tracking-info-db.util';
import { OrderDBUtil } from './utils/order-db.util';
import { OrderHelperUtil } from './utils/order-helper.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderModel,
      LogisticInfoModel,
      LogisticTrackingInfoModel,
    ]),
    ProductModule,
    CommonModule,
  ],
  providers: [
    OrderService,
    OrderDBUtil,
    LogisticInfoDBUtil,
    LogisticTrackingInfoDBUtil,
    OrderHelperUtil,
  ],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
