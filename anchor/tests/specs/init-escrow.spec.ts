import { Program } from '@coral-xyz/anchor';
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
      `InitEscrow completed: ${ExplorerLinkHelper.getTransactionUrl(transactionId)}`,
    );

    const escrowPublicKey = ProgramAccountHelper.getEscrowAccountPublicKey(
      mockUsdc.mint,
    );

    console.log(
      `Escrow public key: ${ExplorerLinkHelper.getAccountUrl(escrowPublicKey)}`,
    );

    const { value: tokenAccounts } = await connection.getTokenAccountsByOwner(
      escrowSigner.publicKey,
      { mint: mockUsdc.mint, programId: program.programId },
    );
    const escrowAccount = tokenAccounts.find((acc) =>
      acc.pubkey.equals(escrowPublicKey),
    );

    expect(tokenAccounts.length).greaterThan(0);

    expect(escrowAccount).toBeDefined();
    expect(escrowAccount?.pubkey.toBase58()).toBe(escrowPublicKey.toBase58());
  });
});
