import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
import { UserDBUtil } from './utils/userDB.util';
import { UserService } from './services/user.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), CommonModule],
  providers: [UserDBUtil, UserService],
  controllers: [],
  exports: [UserDBUtil, UserService],
})
export class UserModule {}
