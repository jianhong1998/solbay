import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

import { UserModel } from './models/user.model';
import { UserService } from './services/user.service';
import { UserDBUtil } from './utils/userDB.util';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), CommonModule],
  providers: [UserDBUtil, UserService],
  controllers: [],
  exports: [UserDBUtil, UserService],
})
export class UserModule {}
