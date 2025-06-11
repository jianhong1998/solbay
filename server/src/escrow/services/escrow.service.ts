import { Program } from '@coral-xyz/anchor';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Connection,
  Keypair,
  PublicKey,
  SendTransactionError,
} from '@solana/web3.js';
import { ESCROW_CONFIG_SEED } from 'src/common/constants';
import { Solbay } from 'src/contract/src';
import { UsdcHelper } from 'src/solana-connection/helpers/usdc.helper';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';

@Injectable()
export class EscrowService {
  private readonly connection: Connection;
  private readonly program: Program<Solbay>;
  private readonly backendSigner: Keypair;

  constructor() {
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
}
