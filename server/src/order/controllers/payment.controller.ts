import { Body, Controller, Post, Put } from '@nestjs/common';
import { UUID } from 'crypto';
import { User } from 'src/common/decorators';
import { UserModel } from 'src/user/models/user.model';

import { CompletePaymentReqDTO } from '../dtos/complete-payment.dto';
import {
  CreatePaymentReqDTO,
  CreatePaymentResDTO,
} from '../dtos/create-payment.dto';
import { PaymentService } from '../services/payment.service';

@Controller('/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/')
  public async createPaymentTransaction(
    @Body() body: CreatePaymentReqDTO,
    @User() buyer: UserModel,
  ): Promise<CreatePaymentResDTO> {
    const { orderIds } = body;

    const paymentTransactionResult =
      await this.paymentService.generatePaymentTransaction({
        buyer,
        orderIds,
      });

    return new CreatePaymentResDTO({
      transaction: paymentTransactionResult?.transaction ?? null,
      latestBlockhash: paymentTransactionResult?.latestBlockhash ?? null,
    });
  }

  @Put('/')
  public async completePaymentProcess(
    @Body() reqBody: CompletePaymentReqDTO,
  ): Promise<{ orderIds: UUID[] }> {
    const { orderIds } = reqBody;

    const paidOrderIds = await this.paymentService.updateOrdersPaymentStatus({
      orderIds,
    });

    return {
      orderIds: paidOrderIds,
    };
  }
}
