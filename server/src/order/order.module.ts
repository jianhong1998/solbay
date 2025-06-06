import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';

import { OrderController } from './controllers/order.controller';
import { PaymentController } from './controllers/payment.controller';
import { LogisticInfoModel } from './models/logistic-info.model';
import { LogisticTrackingInfoModel } from './models/logistic-tracking-info.model';
import { OrderModel } from './models/order.model';
import { TempOrderModel } from './models/temp-order.model';
import { OrderService } from './services/order.service';
import { PaymentService } from './services/payment.service';
import { LogisticInfoDBUtil } from './utils/logistic-info-db.util';
import { LogisticTrackingInfoDBUtil } from './utils/logistic-tracking-info-db.util';
import { OrderDBUtil } from './utils/order-db.util';
import { OrderHelperUtil } from './utils/order-helper.util';
import { TempOrderDBUtil } from './utils/temp-order-db.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderModel,
      LogisticInfoModel,
      LogisticTrackingInfoModel,
      TempOrderModel,
    ]),
    ProductModule,
    UserModule,
    CommonModule,
  ],
  providers: [
    OrderService,
    PaymentService,
    OrderDBUtil,
    LogisticInfoDBUtil,
    LogisticTrackingInfoDBUtil,
    TempOrderDBUtil,
    OrderHelperUtil,
  ],
  controllers: [OrderController, PaymentController],
  exports: [OrderService],
})
export class OrderModule {}
