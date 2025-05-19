/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BN, Program } from '@coral-xyz/anchor';
import { getAccount, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import { Solbay } from '../../target/types/solbay';
import { ProgramAccountHelper } from '../utils/account.util';
import { ExplorerLinkHelper } from '../utils/explorer-link.helper';
import { MockUsdcUtil } from '../utils/mock-usdc.util';
import { ProgramUtil } from '../utils/program.util';
import { TransactionHelper } from '../utils/transaction.util';

describe('Test Init Escrow Token Account', () => {
  let connection: Connection;
  let program: Program<Solbay>;
  let escrowSigner: Keypair;
  let mockUsdc: {
    mint: PublicKey;
    authority: Keypair;
  };

  beforeAll(async () => {
    const programUtil = new ProgramUtil<Solbay>();

    const provider = programUtil.getProvider();
    connection = provider.connection;
    program = programUtil.getProgram();

    escrowSigner = ProgramAccountHelper.getAccountKeypair('feePayer');

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

    const instruction = await program.methods
      .initEscrow()
      .accounts({
        mint: mockUsdc.mint,
        signer: escrowSigner.publicKey,
      })
      .instruction();

    const transaction = TransactionHelper.generateTransaction({
      instructions: [instruction],
      payer: escrowSigner.publicKey,
      recentBlockhash: blockhashObj.blockhash,
      signers: [escrowSigner],
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

    // const { value: tokenAccounts } = await connection.getTokenAccountsByOwner(
    //   escrowAuthorityPublicKey,
    //   { mint: mockUsdc.mint, programId: program.programId },
    // );
    // const escrowAccount = tokenAccounts.find((acc) =>
    //   acc.pubkey.equals(escrowPublicKey),
    // );

    // expect(tokenAccounts.length).greaterThan(0);

    // expect(escrowAccount).toBeDefined();
    // expect(escrowAccount?.pubkey.toBase58()).toBe(escrowPublicKey.toBase58());

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

  it('should be able to withdraw when needed', async () => {
    const escrowPublicKey = ProgramAccountHelper.getEscrowAccountPublicKey(
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

    const withdrawAmount = 10_000_000;

    const instruction = await program.methods
      .sampleWithdraw(new BN(withdrawAmount))
      .accounts({
        mint: mockUsdc.mint,
        signer: escrowSigner.publicKey,
      })
      .instruction();

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transaction = TransactionHelper.generateTransaction({
      instructions: [instruction],
      payer: escrowSigner.publicKey,
      recentBlockhash: blockhash,
      signers: [escrowSigner],
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
      `Recipient: ${ExplorerLinkHelper.getAccountUrl(escrowSigner.publicKey)}\n`,
    );
  });
});
