import { Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { User } from 'src/common/decorators';
import { UserModel } from 'src/user/models/user.model';

import { CreateAssociatedTokenAccountResDTO } from '../dtos/create-associated-token-account.dto';
import { GetAssociatedTokenAccountResDTO } from '../dtos/get-associated-token-account.dto';
import { DummyUsdcService } from '../services/dummy-usdc.service';
import { DummyUsdcAccountService } from '../services/dummy-usdc-account.service';

@Controller('/internal/dummy-usdc-account')
export class DummyUsdcAccountController {
  constructor(
    private readonly dummyUsdcAccountService: DummyUsdcAccountService,
    private readonly dummyUsdcService: DummyUsdcService,
  ) {}

  @Get('/')
  public async getAssociatedTokenAccount(
    @User() user: UserModel,
  ): Promise<GetAssociatedTokenAccountResDTO> {
    const owner = new PublicKey(user.publicKey);

    const account =
      await this.dummyUsdcAccountService.getAssociatedTokenAccount(owner);

    if (!account) throw new NotFoundException(`Token account is not found!`);

    const mint = await this.dummyUsdcService.getUsdcMint();

    return new GetAssociatedTokenAccountResDTO(account, mint);
  }

  @Post('/')
  public async getCreateAssociatedTokenAccountTransaction(
    @User() user: UserModel,
  ): Promise<CreateAssociatedTokenAccountResDTO> {
    const ownerPublicKey = new PublicKey(user.publicKey);

    const { transaction, latestBlockhash } =
      await this.dummyUsdcAccountService.getInitAssociatedTokenAccountTransaction(
        ownerPublicKey,
      );

    return new CreateAssociatedTokenAccountResDTO(transaction, latestBlockhash);
  }
}
