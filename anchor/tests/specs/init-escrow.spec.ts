/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as anchor from '@coral-xyz/anchor';
import {
  getAccount,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  transferChecked,
} from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import { Solbay } from '../../target/types/solbay';
import { ProgramAccountHelper } from '../utils/account.util';
import { AirdropHelper } from '../utils/airdrop.helper';
import { ExplorerLinkHelper } from '../utils/explorer-link.helper';
import { MockUsdcUtil } from '../utils/mock-usdc.util';
import { ProgramUtil } from '../utils/program.util';
import { TransactionHelper } from '../utils/transaction.util';

describe('Test Init Escrow Token Account', () => {
  let connection: Connection;
  let program: anchor.Program<Solbay>;
  let initEscrowSigner: Keypair;
  let randomSigner: Keypair;
  let mockUsdc: {
    mint: PublicKey;
    authority: Keypair;
  };

  beforeAll(async () => {
    const programUtil = new ProgramUtil<Solbay>();

    const provider = programUtil.getProvider();
    connection = provider.connection;
    program = programUtil.getProgram();

    initEscrowSigner = ProgramAccountHelper.getAccountKeypair('feePayer');
    randomSigner = Keypair.generate();

    await AirdropHelper.requestAirdrop({
      connection,
      publicKey: randomSigner.publicKey,
      amount: 1,
    });

    const { authority, mint } = await MockUsdcUtil.getMockUsdc(
      connection,
      true,
    );

    mockUsdc = {
      authority,
      mint,
    };
  }, 30_000);

  it('should create new escrow account', async () => {
    const blockhashObj = await connection.getLatestBlockhash();

    const escrowProfitPercentage = 2; // 2%
    const instruction = await program.methods
      .initEscrow(escrowProfitPercentage)
      .accounts({
        mint: mockUsdc.mint,
        signer: initEscrowSigner.publicKey,
      })
      .instruction();

    const transaction = TransactionHelper.generateTransaction({
      instructions: [instruction],
      payer: initEscrowSigner.publicKey,
      recentBlockhash: blockhashObj.blockhash,
      signers: [initEscrowSigner],
    });
    const transactionId = await TransactionHelper.sendAndConfirmTransaction({
      connection,
      transaction,
      blockhashObj,
    });

    console.log(
      `InitEscrow completed: ${ExplorerLinkHelper.getTransactionUrl(transactionId)}\n`,
    );

    const escrowPublicKey = ProgramAccountHelper.getEscrowAccountPublicKey(
      mockUsdc.mint,
      'escrow',
    );
    const escrowAuthorityPublicKey =
      ProgramAccountHelper.getEscrowAccountPublicKey(
        mockUsdc.mint,
        'authority',
      );

    console.log(
      `Escrow Token Account: ${ExplorerLinkHelper.getAccountUrl(escrowPublicKey)}\n\nEscrow Authority: ${ExplorerLinkHelper.getAccountUrl(escrowAuthorityPublicKey)}`,
    );

    const escrowTokenAccount = await getAccount(
      connection,
      escrowPublicKey,
      'confirmed',
      TOKEN_PROGRAM_ID,
    );

    expect(escrowTokenAccount.address.toBase58()).toBe(
      escrowPublicKey.toBase58(),
    );
    expect(escrowTokenAccount.owner.toBase58()).toBe(
      escrowAuthorityPublicKey.toBase58(),
    );
    expect(escrowTokenAccount.mint.toBase58()).toBe(mockUsdc.mint.toBase58());
    expect(Number(escrowTokenAccount.amount)).toBe(0);
  });

  describe('Random signer withdraw with solbay program', () => {
    let escrowPublicKey: PublicKey;
    beforeAll(async () => {
      escrowPublicKey = ProgramAccountHelper.getEscrowAccountPublicKey(
        mockUsdc.mint,
        'escrow',
      );

      await MockUsdcUtil.mintMockUsdc({
        connection,
        amount: 10,
        recipient: escrowPublicKey,
        mint: mockUsdc.mint,
        mintAuthority: mockUsdc.authority,
        accountType: 'token-account',
      });
    }, 30_000);

    it('should be able to withdraw', async () => {
      const withdrawAmount = 10_000_000;

      const instruction = await program.methods
        .sampleWithdraw(new anchor.BN(withdrawAmount))
        .accounts({
          mint: mockUsdc.mint,
          signer: randomSigner.publicKey,
        })
        .instruction();

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transaction = TransactionHelper.generateTransaction({
        instructions: [instruction],
        payer: randomSigner.publicKey,
        recentBlockhash: blockhash,
        signers: [randomSigner],
      });
      const transactionId = await TransactionHelper.sendAndConfirmTransaction({
        connection,
        transaction,
        blockhashObj: {
          blockhash,
          lastValidBlockHeight,
        },
      });

      console.log(
        `Withdraw transaction done: ${ExplorerLinkHelper.getTransactionUrl(transactionId)}\n`,
      );
      console.log(
        `Escrow Token Account: ${ExplorerLinkHelper.getAccountUrl(escrowPublicKey)}\n`,
      );
      console.log(
        `Recipient: ${ExplorerLinkHelper.getAccountUrl(randomSigner.publicKey)}\n`,
      );

      const randomSignerTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        randomSigner,
        mockUsdc.mint,
        randomSigner.publicKey,
        false,
        'confirmed',
        { commitment: 'confirmed' },
      );
      const escrowTokenAccount = await getAccount(
        connection,
        escrowPublicKey,
        'confirmed',
      );

      expect(Number(randomSignerTokenAccount.amount)).toEqual(withdrawAmount);
      expect(Number(escrowTokenAccount.amount)).toEqual(0);
    });
  });

  describe('InitEscrow signer withdraw without solbay program', () => {
    let escrowPublicKey: PublicKey;
    beforeAll(async () => {
      escrowPublicKey = ProgramAccountHelper.getEscrowAccountPublicKey(
        mockUsdc.mint,
        'escrow',
      );

      await MockUsdcUtil.mintMockUsdc({
        connection,
        amount: 10,
        recipient: escrowPublicKey,
        mint: mockUsdc.mint,
        mintAuthority: mockUsdc.authority,
        accountType: 'token-account',
      });

      await getOrCreateAssociatedTokenAccount(
        connection,
        initEscrowSigner, // payer
        mockUsdc.mint,
        initEscrowSigner.publicKey, // account owner
        true,
        'confirmed',
        { commitment: 'confirmed' },
      );
    }, 30_000);

    it('should be blocked for transfer fund our from the escrow token account', async () => {
      const withdrawAmount = 10_000_000;

      try {
        const transactionId = await transferChecked(
          connection,
          initEscrowSigner, // payer
          escrowPublicKey, // from
          mockUsdc.mint,
          initEscrowSigner.publicKey, // to
          initEscrowSigner, // owner of the `from` account
          withdrawAmount,
          6, // decimals
        );

        expect(transactionId).toBeUndefined();

        console.error(
          `Withdraw without program successfully: ${ExplorerLinkHelper.getTransactionUrl(transactionId)}`,
        );
      } catch (_error) {
        const escrowTokenAccount = await getAccount(
          connection,
          escrowPublicKey,
        );
        expect(Number(escrowTokenAccount.amount)).toEqual(10_000_000);
      }
    });
  });
});
