import { Module } from '@nestjs/common';

import { EscrowController } from './controllers/escrow.controller';
import { EscrowService } from './services/escrow.service';

@Module({
  imports: [],
  providers: [EscrowService],
  controllers: [EscrowController],
  exports: [],
})
export class EscrowModule {}
