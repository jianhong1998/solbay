import {
  createMint,
  getAccount,
  getMint,
  Mint,
  mintToChecked,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
} from '@solana/spl-token';
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import { USDC_MINT_PUBLICK_KEY_MAINNET } from 'src/common/constants/public-key.constant';

import { ClusterType } from '../cluster.type';
import { DummyUsdcKeypairGenerator } from '../dummy-keypairs/usdc.keypair';
import { ConnectionUtil } from '../utils/connection.util';
import { AccountHelper } from './account.helper';
import { AirdropHelper } from './airdrop.helper';
import { ExplorerLinkHelper } from './explorer-link.helper';

export class UsdcHelper {
  public readonly dummyUsdcMintKeypair: Keypair;
  public readonly dummyUsdcAuthorityKeypair: Keypair;
  public readonly connection: Connection;

  private static self: UsdcHelper;

  private constructor(public readonly clusterType: ClusterType) {
    this.dummyUsdcMintKeypair = DummyUsdcKeypairGenerator.getUsdcMintKeypair();
    this.dummyUsdcAuthorityKeypair =
      DummyUsdcKeypairGenerator.getUsdcAuthorityKeypair();
    this.connection = ConnectionUtil.getConnection();
  }

  /**
   * Get USDC Mint public key
   */
  public static getUsdcMintPublicKey(): PublicKey {
    const self = this.getSelf();

    switch (self.clusterType) {
      case 'mainnet-beta':
        return USDC_MINT_PUBLICK_KEY_MAINNET;
      case 'devnet':
      case 'testnet':
      case 'localnet':
      default:
        return self.dummyUsdcMintKeypair.publicKey;
    }
  }

  /**
   * Get Dummy USDC mint authority.
   * @throw Error if call this with connecting to mainnet
   */
  public static getUsdcMintAuthority(): Keypair {
    const self = this.getSelf();

    switch (self.clusterType) {
      case 'mainnet-beta':
        throw new Error('Cannot get Dummy USDC mint authority on Mainnet');
      default:
        return self.dummyUsdcAuthorityKeypair;
    }
  }

  /**
   * Get Dummy USDC mint keypair.
   * @throw Error if call this with connecting to mainnet
   */
  public static getUsdcMintKeypair(): Keypair {
    const self = this.getSelf();
    if (self.clusterType === 'mainnet-beta')
      throw new Error('Cannot setup dummy USDC on mainnet');

    return self.dummyUsdcMintKeypair;
  }

  /**
   * Setup dummy USDC.
   * @throw Error if call this with connecting to mainnet
   */
  public static async setupDummyUsdc(): Promise<void> {
    const self = this.getSelf();
    const authorityKeypair = this.getUsdcMintAuthority();
    const mintKeypair = this.getUsdcMintKeypair();

    if (self.clusterType === 'mainnet-beta')
      throw new Error('Cannot setup dummy USDC on mainnet');

    let mint: Mint;

    try {
      mint = await getMint(
        self.connection,
        mintKeypair.publicKey,
        'confirmed',
        TOKEN_PROGRAM_ID,
      );
    } catch (_error) {
      if (self.clusterType === 'localnet') {
        await AirdropHelper.requestAirdrop({
          connection: self.connection,
          amount: 10,
          publicKey: authorityKeypair.publicKey,
        });
      }

      const publicKey = await createMint(
        self.connection,
        authorityKeypair,
        authorityKeypair.publicKey,
        authorityKeypair.publicKey,
        6,
        mintKeypair,
        { commitment: 'confirmed', maxRetries: 3 },
      );

      mint = await getMint(
        self.connection,
        publicKey,
        'confirmed',
        TOKEN_PROGRAM_ID,
      );
    }

    if (!mint.mintAuthority?.equals(authorityKeypair.publicKey))
      throw new Error('Unexpected authority for created USDC mint');
  }

  /**
   * Airdrop dummy USDC to the account.
   * @throw Error if call this with connecting to mainnet
   */
  public static async airdropDummyUsdc(params: {
    recipient: PublicKey;
    amount: number;
  }): Promise<number> {
    const { amount, recipient } = params;
    const self = this.getSelf();

    if (self.clusterType === 'mainnet-beta')
      throw new Error('Cannot airdrop dummy USDC on mainnet');

    const mint = await getMint(
      self.connection,
      self.dummyUsdcMintKeypair.publicKey,
      'confirmed',
      TOKEN_PROGRAM_ID,
    );

    if (!mint.isInitialized)
      throw new Error('Dummy USDC is not initialised yet');

    const mintPublicKey = mint.address;
    const mintAuthorityKeypair = self.dummyUsdcAuthorityKeypair;

    const transactionId = await mintToChecked(
      self.connection,
      mintAuthorityKeypair,
      mintPublicKey,
      recipient,
      mintAuthorityKeypair,
      amount,
      mint.decimals,
      undefined,
      { commitment: 'confirmed' },
      TOKEN_PROGRAM_ID,
    );

    const transactionUrl = ExplorerLinkHelper.getTransactionUrl(transactionId);

    // eslint-disable-next-line no-console
    console.log(
      `Successfully airdrop ${amount} dummy USDC to recipient (${recipient.toBase58()}): ${transactionUrl}`,
    );

    const recipientAccount = await getAccount(
      self.connection,
      recipient,
      'confirmed',
      TOKEN_PROGRAM_ID,
    );

    return Number(recipientAccount.amount);
  }

  /**
   * Generate an instruction to create an associated token account for Dummy USDC
   * @throws Error if call this with connecting to mainnet
   */
  public static generateAssociatedTokenAccountCreationInstruction(
    owner: PublicKey,
  ): TransactionInstruction {
    const self = this.getSelf();
    const { dummyUsdcMintKeypair: mintKeypair, clusterType } = self;

    if (clusterType === 'mainnet-beta')
      throw new Error(
        'Cannot setup associated token account for dummy USDC on mainnet',
      );

    return AccountHelper.generateAssociatedTokenAccountCreationInstruction(
      owner,
      mintKeypair.publicKey,
    );
  }

  /**
   * Convert USDC to micro-USDC or micro-USDC to USDC.
   * @param output Input `USDC` to convert micro-USDC to USDC. Input `micro-USDC` to convert USDC to micro-USDC.
   * @returns Value of USDC if output select `USDC`. Value of micro-USDC if output select `micro-USDC`.
   */
  public static async convertAmount(
    amount: number,
    output: 'USDC' | 'micro-USDC',
  ): Promise<number> {
    const self = this.getSelf();
    const mintPublicKey = this.getUsdcMintPublicKey();
    let mint: Mint;

    try {
      mint = await getMint(self.connection, mintPublicKey, 'confirmed');
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError)
        throw new Error('USDC is not initialized yet.');
      throw error;
    }

    const decimalValue = Math.pow(10, mint.decimals);

    switch (output) {
      case 'USDC':
        return amount / decimalValue;
      case 'micro-USDC':
        return amount * decimalValue;
      default:
        throw new Error('Invalid output type');
    }
  }

  public static async getUsdcMint(): Promise<Mint> {
    const { connection } = this.getSelf();
    const mintPublicKey = this.getUsdcMintPublicKey();

    return await getMint(
      connection,
      mintPublicKey,
      'confirmed',
      TOKEN_PROGRAM_ID,
    );
  }

  private static getSelf(): UsdcHelper {
    if (!this.self) {
      const cluster = ConnectionUtil.getClusterType();
      this.self = new UsdcHelper(cluster);
    }

    return this.self;
  }
}
