import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Account, TokenAccountNotFoundError } from '@solana/spl-token';
import {
  BlockhashWithExpiryBlockHeight,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js';
import { ClusterType } from 'src/solana-connection/cluster.type';
import { DummyUsdcKeypairGenerator } from 'src/solana-connection/dummy-keypairs/usdc.keypair';
import { AccountHelper } from 'src/solana-connection/helpers/account.helper';
import { UsdcHelper } from 'src/solana-connection/helpers/usdc.helper';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';

@Injectable()
export class DummyUsdcAccountService {
  private readonly clusterType: ClusterType;

  constructor() {
    this.clusterType = ConnectionUtil.getClusterType();
  }

  public async getAssociatedTokenAccount(
    owner: PublicKey,
  ): Promise<Account | null> {
    const usdcMint = DummyUsdcKeypairGenerator.getUsdcMintKeypair().publicKey;
    const tokenAccountPublicKey =
      AccountHelper.generateAssociatedTokenAccountPublicKey(owner, usdcMint);

    try {
      return await AccountHelper.getTokenAccount(tokenAccountPublicKey);
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) return null;

      throw error;
    }
  }

  public async getInitAssociatedTokenAccountTransaction(
    ownerPublicKey: PublicKey,
  ): Promise<{
    transaction: VersionedTransaction;
    latestBlockhash: BlockhashWithExpiryBlockHeight;
  }> {
    if (this.clusterType === 'mainnet-beta')
      throw new BadRequestException(
        'Cannot generate associated token account for dummy USDC on mainnet',
      );

    let existingTokenAccount: Account | null;

    try {
      existingTokenAccount =
        await this.getAssociatedTokenAccount(ownerPublicKey);
    } catch (_error) {
      existingTokenAccount = null;
    }

    if (existingTokenAccount)
      throw new ConflictException('Associated token account already exist');

    const instruction =
      UsdcHelper.generateAssociatedTokenAccountCreationInstruction(
        ownerPublicKey,
      );

    const { transaction, latestBlockhash } =
      await TransactionUtil.createTransaction({
        instructions: [instruction],
        payerPublicKey: ownerPublicKey,
      });

    return {
      transaction,
      latestBlockhash,
    };
  }
}
