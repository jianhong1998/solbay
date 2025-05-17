import { Program } from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import { Solbay } from '../../target/types/solbay';
import { ProgramAccountHelper } from '../utils/account.util';
import { ProgramUtil } from '../utils/program.util';
import { UsdcUtil } from '../utils/usdc.util';

describe('Test Init Escrow Token Account', () => {
  let connection: Connection;
  let program: Program<Solbay>;
  let escrowSigner: Keypair;
  let _usdc: {
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

    _usdc = {
      authority,
      mint,
    };
  }, 30_000);

  it('should create new escrow account', async () => {
    const _blockhashObj = await connection.getLatestBlockhash();

    const _instruction = await program.methods
      .initEscrow()
      .accounts({
        mint: '',
        signer: escrowSigner.publicKey,
      })
      .signers([escrowSigner])
      .instruction();
  });
});
