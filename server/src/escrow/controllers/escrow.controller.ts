import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { LoggerUtil } from 'src/common/utils/logger.util';

import { WithdrawProfitReqDTO } from '../dto/withdraw-profit.dto';
import { EscrowService } from '../services/escrow.service';

@Controller('/escrow')
export class EscrowController {
  constructor(
    private readonly escrowService: EscrowService,
    private readonly loggerUtil: LoggerUtil,
  ) {}

  @Post('/')
  @Public()
  public async initEscrow() {
    const escrowConfig = await this.escrowService.getEscrowConfig();

    if (escrowConfig)
      throw new BadRequestException('Escrow is already initialized.');

    const result = await this.escrowService.initializeEscrowConfig();

    return result;
  }

  @Post('/withdraw-profit')
  @Public()
  public async withdrawProfit(@Body() reqBody: WithdrawProfitReqDTO) {
    const logger = this.loggerUtil.createLogger('Endpoint - WithdrawProfit');
    const { amount } = reqBody;

    const { transactionId, url } =
      await this.escrowService.withdrawProfit(amount);

    logger.log(`Withdraw profit successfully: ${transactionId}`);

    return { transactionId, url };
  }

  @Get('/operation-account')
  @Public()
  public async getEscrowOperationAccountPublicKey() {
    const { account } = await this.escrowService.getEscrowOperationAccount();

    if (!account) throw new NotFoundException('Account is not found.');

    return { publicKey: account.address.toBase58() };
  }
}
