import { Program } from '@coral-xyz/anchor';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Account } from '@solana/spl-token';
import {
  Connection,
  Keypair,
  PublicKey,
  SendTransactionError,
  Signer,
} from '@solana/web3.js';
import { BN } from 'bn.js';
import { ESCROW_CONFIG_SEED } from 'src/common/constants';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { Solbay } from 'src/contract/src';
import { ProgramErrorHelper } from 'src/on-chain-program/utils/program-error.helper';
import { AccountHelper } from 'src/solana-connection/helpers/account.helper';
import { ExplorerLinkHelper } from 'src/solana-connection/helpers/explorer-link.helper';
import { UsdcHelper } from 'src/solana-connection/helpers/usdc.helper';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';

@Injectable()
export class EscrowService {
  private readonly connection: Connection;
  private readonly program: Program<Solbay>;
  private readonly backendSigner: Keypair;

  constructor(private readonly loggerUtil: LoggerUtil) {
    this.connection = ConnectionUtil.getConnection();
    this.program = ConnectionUtil.getProgram();
    this.backendSigner = ConnectionUtil.getSigner();
  }

  public async initializeEscrowConfig(): Promise<{ transactionId: string }> {
    const mint = UsdcHelper.getUsdcMintPublicKey();
    const signer = this.backendSigner;
    const escrowProfitPercentage = 2; // 2%

    const instruction = await this.program.methods
      .initEscrow(escrowProfitPercentage)
      .accounts({
        mint,
        signer: signer.publicKey,
      })
      .instruction();

    const { transaction, latestBlockhash } =
      await TransactionUtil.createTransaction({
        instructions: [instruction],
        payerPublicKey: signer.publicKey,
      });

    transaction.sign([signer]);

    try {
      const transactionId = await TransactionUtil.sendAndConfirmTransaction({
        connection: this.connection,
        latestBlockhash,
        transaction,
        commitment: 'confirmed',
      });
      return { transactionId };
    } catch (error) {
      if (!(error instanceof SendTransactionError)) throw error;

      const errorMessage = error.message;

      if (
        errorMessage
          .toLowerCase()
          .includes(
            'attempt to debit an account but found no record of a prior credit',
          )
      )
        throw new BadRequestException('Fee payer does not have enough fund');

      throw error;
    }
  }

  public async getEscrowConfig() {
    const staticSeedBytes = Buffer.from(ESCROW_CONFIG_SEED);
    const mintPublicKeyBytes = UsdcHelper.getUsdcMintPublicKey().toBuffer();

    const [escrowConfigPublicKey] = PublicKey.findProgramAddressSync(
      [staticSeedBytes, mintPublicKeyBytes],
      this.program.programId,
    );

    try {
      const escrowConfig = await this.program.account.escrowConfig.fetch(
        escrowConfigPublicKey,
        'confirmed',
      );

      return escrowConfig;
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      const message = error.message;
      if (message.toLowerCase().includes('account does not exist')) {
        return null;
      }

      throw error;
    }
  }

  public async withdrawProfit(amount: number): Promise<{
    transactionId: string;
    url: string;
  }> {
    const amountInMicroUsdc = new BN(
      await UsdcHelper.convertAmount(amount, 'micro-USDC'),
    );
    const mint = UsdcHelper.getUsdcMintPublicKey();
    const signer = this.backendSigner;

    const escrowConfig = await this.getEscrowConfig();
    if (!escrowConfig)
      throw new BadRequestException('Escrow is not initialised yet');

    await this.getOrCreateTokenAccount(signer.publicKey, signer);

    /* Generate and send transaction */

    const instruction = await this.program.methods
      .withdrawFromOperationAccount(amountInMicroUsdc)
      .accounts({
        mint,
        recipient: escrowConfig.withdrawRecipient,
        signer: signer.publicKey,
      })
      .instruction();

    const { transaction, latestBlockhash } =
      await TransactionUtil.createTransaction({
        instructions: [instruction],
        payerPublicKey: signer.publicKey,
      });
    transaction.sign([signer]);

    try {
      const transactionId = await TransactionUtil.sendAndConfirmTransaction({
        connection: this.connection,
        transaction,
        latestBlockhash,
        commitment: 'confirmed',
      });

      const url = ExplorerLinkHelper.getTransactionUrl(transactionId);

      return {
        transactionId,
        url,
      };
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      const programError = ProgramErrorHelper.parseError(error);

      if (!programError) throw error;

      throw new BadRequestException(programError.errorMessage);
    }
  }

  /**
   * Get token account. Create token account if not exist.
   */
  private async getOrCreateTokenAccount(
    publicKey: PublicKey,
    signer: Signer,
  ): Promise<Account> {
    const logger = this.loggerUtil.createLogger('GetOrCreateTokenAccount');
    const usdcMintPublicKey = UsdcHelper.getUsdcMintPublicKey();

    const tokenAccountPublicKey =
      AccountHelper.generateAssociatedTokenAccountPublicKey(
        publicKey,
        usdcMintPublicKey,
      );

    let account = await AccountHelper.getTokenAccount(tokenAccountPublicKey);

    if (account) return account;

    const createAccountInstruction =
      AccountHelper.generateAssociatedTokenAccountCreationInstruction(
        publicKey,
        usdcMintPublicKey,
      );
    const { latestBlockhash, transaction } =
      await TransactionUtil.createTransaction({
        instructions: [createAccountInstruction],
        payerPublicKey: signer.publicKey,
      });

    transaction.sign([signer]);

    const transactionId = await TransactionUtil.sendAndConfirmTransaction({
      connection: this.connection,
      latestBlockhash,
      transaction,
      commitment: 'confirmed',
    });

    logger.log(
      `Transaction for creating token account is completed: ${ExplorerLinkHelper.getTransactionUrl(transactionId)}`,
    );

    account = await AccountHelper.getTokenAccount(tokenAccountPublicKey);

    if (!account)
      throw new Error(
        `Failed to create token account (${tokenAccountPublicKey.toBase58()})!`,
      );

    return account;
  }
}
