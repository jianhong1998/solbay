import { Program } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import { Solbay } from '../../target/types/solbay';
import { ProgramAccountHelper } from '../utils/account.util';
import { ProgramUtil } from '../utils/program.util';
import { TransactionHelper } from '../utils/transaction.util';
import { UsdcUtil } from '../utils/usdc.util';

describe('Test Init Escrow Token Account', () => {
  let connection: Connection;
  let program: Program<Solbay>;
  let escrowSigner: Keypair;
  let usdc: {
    mint: PublicKey;
    authority: Keypair;
  };

  beforeAll(async () => {
    const programUtil = new ProgramUtil<Solbay>();

    const provider = programUtil.getProvider();
    connection = provider.connection;
    program = programUtil.getProgram();

    escrowSigner = ProgramAccountHelper.getAccountKeypair('feePayer');

    const { authority, mint } = await UsdcUtil.getMockUsdc(connection);

    usdc = {
      authority,
      mint,
    };
  }, 30_000);

  it('should create new escrow account', async () => {
    const blockhashObj = await connection.getLatestBlockhash();

    const instruction = await program.methods
      .initEscrow()
      .accounts({
        mint: usdc.mint,
        signer: escrowSigner.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
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

    console.log(`InitEscrow completed: ${transactionId}`);

    const escrowPublicKey = ProgramAccountHelper.getEscrowAccountPublicKey(
      usdc.mint,
    );

    console.log(`Escrow public key: ${escrowPublicKey.toBase58()}`);
  });
});
