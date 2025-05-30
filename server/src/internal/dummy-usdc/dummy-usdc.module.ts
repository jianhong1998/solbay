import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';

import { DummyUsdcController } from './controllers/dummy-usdc.controller';
import { DummyUsdcAccountController } from './controllers/dummy-usdc-account.controller';
import { DummyUsdcService } from './services/dummy-usdc.service';
import { DummyUsdcAccountService } from './services/dummy-usdc-account.service';

@Module({
  imports: [CommonModule],
  providers: [DummyUsdcService, DummyUsdcAccountService],
  controllers: [DummyUsdcController, DummyUsdcAccountController],
  exports: [],
})
export class DummyUsdcModule {}
