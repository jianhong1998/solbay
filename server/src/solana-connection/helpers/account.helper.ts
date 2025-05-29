import {
  Account,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  TokenInvalidAccountOwnerError,
} from '@solana/spl-token';
import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';

import { ConnectionUtil } from '../utils/connection.util';

export class AccountHelper {
  public readonly connection: Connection;

  private static self: AccountHelper;

  private constructor() {
    this.connection = ConnectionUtil.getConnection();
  }

  /**
   * Get a token account that located at the `accountPublicKey`.
   * @returns Return token account found at the `accountPublicKey`. Return `null` if not found.
   */
  public static async getTokenAccount(
    accountPublicKey: PublicKey,
  ): Promise<Account | null> {
    const self = this.getSelf();
    const { connection } = self;

    try {
      const account = await getAccount(
        connection,
        accountPublicKey,
        'confirmed',
        TOKEN_PROGRAM_ID,
      );

      return account;
    } catch (error) {
      if (error instanceof TokenInvalidAccountOwnerError) {
        return null;
      }

      throw error;
    }
  }

  public static generateAssociatedTokenAccountCreationInstruction(
    owner: PublicKey,
    mint: PublicKey,
  ): TransactionInstruction {
    const instruction = createAssociatedTokenAccountInstruction(
      owner, // Payer
      owner, // AssociatedTokenAccount PublicKey
      owner, // Owner
      mint, // Mint
      TOKEN_PROGRAM_ID, // TokenProgram PublicKey
      ASSOCIATED_TOKEN_PROGRAM_ID, // AssociatedTokenProgram PublicKey
    );

    return instruction;
  }

  private static getSelf(): AccountHelper {
    if (!this.self) this.self = new AccountHelper();

    return this.self;
  }
}
