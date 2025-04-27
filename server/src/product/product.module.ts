import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

import { BuyerProductController } from './controllers/buyer-product.controller';
import { ProductModel } from './models/product.model';
import { ProductService } from './services/product.service';
import { ProductDBUtil } from './utils/product-db.util';

@Module({
  imports: [TypeOrmModule.forFeature([ProductModel]), UserModule],
  controllers: [BuyerProductController],
  providers: [ProductService, ProductDBUtil],
  exports: [ProductService],
})
export class ProductModule {}
