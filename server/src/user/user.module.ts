import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

import { SellerController } from './controller/seller.controller';
import { SellerModel } from './models/seller.model';
import { UserModel } from './models/user.model';
import { SellerService } from './services/seller.service';
import { UserService } from './services/user.service';
import { SellerDBUtil } from './utils/sellerDB.util';
import { UserDBUtil } from './utils/userDB.util';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, SellerModel]), CommonModule],
  providers: [UserDBUtil, UserService, SellerService, SellerDBUtil],
  controllers: [SellerController],
  exports: [UserDBUtil, UserService, SellerService],
})
export class UserModule {}
