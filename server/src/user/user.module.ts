import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
import { UserDBUtil } from './utils/userDB.util';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [UserDBUtil],
  controllers: [],
  exports: [UserDBUtil],
})
export class UserModule {}
