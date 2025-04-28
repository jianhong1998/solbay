import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

import { BuyerProductController } from './controllers/buyer-product.controller';
import { SellerProductController } from './controllers/seller-product.controller';
import { ProductModel } from './models/product.model';
import { ProductService } from './services/product.service';
import { SellerProductService } from './services/seller-product.service';
import { ProductDBUtil } from './utils/product-db.util';

@Module({
  imports: [TypeOrmModule.forFeature([ProductModel]), UserModule],
  controllers: [BuyerProductController, SellerProductController],
  providers: [ProductService, ProductDBUtil, SellerProductService],
  exports: [ProductService],
})
export class ProductModule {}
