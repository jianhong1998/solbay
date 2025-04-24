import { ForbiddenException, Injectable } from '@nestjs/common';

import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { UUID } from 'crypto';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { TransactionVerificationUtil } from 'src/solana-connection/utils/transaction-verification.util';
import { TokenUtil } from '../utils/token.util';
import { UserModel } from 'src/user/models/user.model';
import { Response } from 'express';
import { TOKEN_COOKIE_NAME } from '../constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenUtil: TokenUtil,
    private readonly loggerUtil: LoggerUtil,
  ) {}

  public async generateToken(userId: UUID): Promise<{ token: string }> {
    const { token } = await this.tokenUtil.generateToken({
      userId,
    });

    return { token };
  }

  public verifyLoginTransaction(
    serializedTransaction: string,
    publicKeyString: string,
  ): boolean {
    const logger = this.loggerUtil.createLogger(
      'AuthService - VerifyLoginTransaction',
    );
    const transaction = VersionedTransaction.deserialize(
      Buffer.from(serializedTransaction, 'base64'),
    );

    /* Step - Verify transaction contains login instruction */

    const loginInstructionHex =
      TransactionVerificationUtil.getInstructionDiscriminatorHex('login');
    const transactionVerificationResult =
      TransactionVerificationUtil.verifyContainRequiredInstruction(
        transaction,
        loginInstructionHex,
      );

    if (!transactionVerificationResult.hasRequiredInstruction) {
      logger.warn('Transaction does not contain login instruction');
      return false;
    }

    /* Step - Verify if public key passed into login instruction */

    const accountKeyIndexes = new Set(
      transaction.message.compiledInstructions[
        transactionVerificationResult.instructionIndex
      ].accountKeyIndexes,
    );

    const accountKeyMap = new Map(
      transaction.message.staticAccountKeys.map((pubkey, index) => [
        pubkey.toBase58(),
        {
          index,
          passedIntoLoginInstruction: accountKeyIndexes.has(index),
        },
      ]),
    );

    const targetAccountKey = accountKeyMap.get(publicKeyString);

    if (!targetAccountKey || !targetAccountKey.passedIntoLoginInstruction) {
      logger.warn(
        `Public key (${publicKeyString}) not passed into login instruction`,
      );
      return false;
    }

    /* Step - Verify if public signed the transaction */
    const isSigner = transaction.message.isAccountSigner(
      targetAccountKey.index,
    );

    if (!isSigner) {
      logger.warn(
        `Public key (${publicKeyString}) is not signer in transaction`,
      );
      return false;
    }

    return true;
  }

  public async processLogout(params: {
    res: Response;
    user: UserModel | undefined;
    publicKey: PublicKey;
  }): Promise<Response> {
    const logger = this.loggerUtil.createLogger('ProcessLogout');
    const { publicKey, res, user } = params;

    if (user && user.publicKey !== publicKey.toBase58()) {
      logger.warn(
        `Logout request failed: Public key (${publicKey.toBase58()}) and user (${user.uuid}) mismatch.`,
      );
      return res;
    }

    res.cookie(TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(),
    });

    return res;
  }
}
