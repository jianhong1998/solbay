import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import {
  BlockhashWithExpiryBlockHeight,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js';
import { AccountHelper } from 'src/solana-connection/helpers/account.helper';
import { UsdcHelper } from 'src/solana-connection/helpers/usdc.helper';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';

import {
  IAirdropUsdcParams,
  IAirdropUsdcResult,
} from '../types/airdrop-usdc.type';

@Injectable()
export class DummyUsdcService {
  constructor() {}

  public async initUsdc(): Promise<PublicKey> {
    await UsdcHelper.setupDummyUsdc();

    return UsdcHelper.getUsdcMint();
  }

  public async airdropUsdc(
    params: IAirdropUsdcParams,
  ): Promise<IAirdropUsdcResult> {
    const { amount, publicKey } = params;

    const associatedTokenAccount =
      await AccountHelper.getTokenAccount(publicKey);

    if (!associatedTokenAccount)
      throw new BadRequestException('Token account does not exist');

    const balance = await UsdcHelper.airdropDummyUsdc({
      recipient: associatedTokenAccount.address,
      amount: amount * 1_000_000,
    });

    return {
      balance,
      publicKey: associatedTokenAccount.address,
    };
  }

  public async initAssociatedTokenAccount(ownerPublicKey: PublicKey): Promise<{
    transaction: VersionedTransaction;
    latestBlockhash: BlockhashWithExpiryBlockHeight;
  }> {
    const existingTokenAccount =
      await AccountHelper.getTokenAccount(ownerPublicKey);

    if (existingTokenAccount)
      throw new ConflictException('Associated token account already exist');

    const instruction =
      UsdcHelper.generateAssociatedTokenAccountCreationInstruction(
        ownerPublicKey,
      );

    return await TransactionUtil.createTransaction({
      instructions: [instruction],
      payerPublicKey: ownerPublicKey,
    });
  }
}
