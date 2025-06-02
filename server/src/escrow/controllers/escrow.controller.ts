import { BadRequestException, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators';

import { EscrowService } from '../services/escrow.service';

@Controller('/escrow')
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post('/')
  @Public()
  public async initEscrow() {
    const escrowConfig = await this.escrowService.getEscrowConfig();

    if (escrowConfig)
      throw new BadRequestException('Escrow is already initialized.');

    const result = await this.escrowService.initializeEscrowConfig();

    return result;
  }
}
