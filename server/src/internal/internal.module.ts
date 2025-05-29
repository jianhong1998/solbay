import { Module } from '@nestjs/common';

import { DummyUsdcModule } from './dummy-usdc/dummy-usdc.module';

@Module({
  imports: [DummyUsdcModule],
})
export class InternalModule {}
