import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';

import { DummyUsdcController } from './controllers/dummy-usdc.controller';
import { DummyUsdcService } from './services/dummy-usdc.service';

@Module({
  imports: [CommonModule],
  providers: [DummyUsdcService],
  controllers: [DummyUsdcController],
  exports: [],
})
export class DummyUsdcModule {}
