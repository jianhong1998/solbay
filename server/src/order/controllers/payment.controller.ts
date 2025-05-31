import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/common/decorators';
import { UserModel } from 'src/user/models/user.model';

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
}
