import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import { ProgramAccountHelper } from '../account.util';
import { ProgramUtil } from '../program.util';
import { TransactionHelper } from '../transaction.util';

type IUseInitEscrowHelperResult = {
  transactionSignature: string | null;
  escrowPublicKey: PublicKey;
};

export const useInitEscrowHelper = async (params: {
  connection: Connection;
  usdcMint: PublicKey;
  escrowSigner: Keypair;
}): Promise<IUseInitEscrowHelperResult> => {
  const programUtil = new ProgramUtil();
  const program = programUtil.getProgram();

  const { connection, usdcMint, escrowSigner } = params;

  const escrowPublicKey = ProgramAccountHelper.getEscrowAccountPublicKey(
    usdcMint,
    'escrow',
  );

  const instruction = await program.methods
    .initEscrow()
    .accounts({
      mint: usdcMint,
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

  const transactionSignature =
    await TransactionHelper.sendAndConfirmTransaction({
      connection,
      blockhashObj: { blockhash, lastValidBlockHeight },
      transaction,
    });

  return {
    transactionSignature,
    escrowPublicKey,
  };
};
