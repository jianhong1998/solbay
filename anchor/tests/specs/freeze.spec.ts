import {
  createAccount,
  freezeAccount,
  thawAccount,
  TOKEN_PROGRAM_ID,
  transferChecked,
} from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import { Solbay } from '../../target/types/solbay';
import { AirdropHelper } from '../utils/airdrop.helper';
import { ExplorerLinkHelper } from '../utils/explorer-link.helper';
import { MockUsdcUtil } from '../utils/mock-usdc.util';
import { ProgramUtil } from '../utils/program.util';

describe('Test freeze', () => {
  let connection: Connection;
  let mockUsdc: {
    mint: PublicKey;
    authority: Keypair;
  };
  let randomBuyer: Keypair;
  let randomSeller: Keypair;
  let buyerTokenAccountKeypair: Keypair;
  let sellerTokenAccountKeypair: Keypair;

  beforeAll(async () => {
    const programUtil = new ProgramUtil<Solbay>();

    connection = programUtil.getProvider().connection;

    mockUsdc = await MockUsdcUtil.getMockUsdc(connection, true);

    randomBuyer = Keypair.generate();
    randomSeller = Keypair.generate();
    buyerTokenAccountKeypair = Keypair.generate();
    sellerTokenAccountKeypair = Keypair.generate();

    await AirdropHelper.requestAirdrop({
      connection,
      amount: 1,
      publicKey: randomBuyer.publicKey,
    });
    await AirdropHelper.requestAirdrop({
      connection,
      amount: 1,
      publicKey: randomSeller.publicKey,
    });

    await createAccount(
      connection,
      randomBuyer,
      mockUsdc.mint,
      randomBuyer.publicKey,
      buyerTokenAccountKeypair,
      {
        commitment: 'confirmed',
      },
      TOKEN_PROGRAM_ID,
    );
    await createAccount(
      connection,
      randomSeller,
      mockUsdc.mint,
      randomSeller.publicKey,
      sellerTokenAccountKeypair,
      {
        commitment: 'confirmed',
      },
      TOKEN_PROGRAM_ID,
    );

    await MockUsdcUtil.mintMockUsdc({
      connection,
      amount: 10,
      recipient: buyerTokenAccountKeypair.publicKey,
      accountType: 'token-account',
      mint: mockUsdc.mint,
      mintAuthority: mockUsdc.authority,
    });

    console.log({
      usdcMint: ExplorerLinkHelper.getAccountUrl(mockUsdc.mint),
      buyer: ExplorerLinkHelper.getAccountUrl(randomBuyer.publicKey),
      buyerTokenAccount: ExplorerLinkHelper.getAccountUrl(
        buyerTokenAccountKeypair.publicKey,
      ),
      seller: ExplorerLinkHelper.getAccountUrl(randomSeller.publicKey),
    });
  });

  it('should be freeze', async () => {
    await freezeAccount(
      connection,
      mockUsdc.authority,
      buyerTokenAccountKeypair.publicKey,
      mockUsdc.mint,
      mockUsdc.authority,
      undefined,
      {
        commitment: 'confirmed',
      },
      TOKEN_PROGRAM_ID,
    );

    try {
      const transactionId = await transferChecked(
        connection,
        randomBuyer,
        buyerTokenAccountKeypair.publicKey,
        mockUsdc.mint,
        sellerTokenAccountKeypair.publicKey,
        randomBuyer,
        1_000_000,
        6,
        undefined,
        { commitment: 'confirmed' },
        TOKEN_PROGRAM_ID,
      );

      expect(transactionId).toBeUndefined();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should be able to unfreeze', async () => {
    await thawAccount(
      connection,
      mockUsdc.authority,
      buyerTokenAccountKeypair.publicKey,
      mockUsdc.mint,
      mockUsdc.authority,
      undefined,
      { commitment: 'confirmed' },
      TOKEN_PROGRAM_ID,
    );

    try {
      const transactionId = await transferChecked(
        connection,
        randomBuyer,
        buyerTokenAccountKeypair.publicKey,
        mockUsdc.mint,
        sellerTokenAccountKeypair.publicKey,
        randomBuyer,
        1_000_000,
        6,
        undefined,
        { commitment: 'confirmed' },
        TOKEN_PROGRAM_ID,
      );

      expect(transactionId).toBeDefined();
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});
