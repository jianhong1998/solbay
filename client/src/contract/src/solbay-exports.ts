// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import SolbayIDL from '../target/idl/solbay.json';
import type { Solbay } from '../target/types/solbay';

// Re-export the generated IDL and type
export { Solbay, SolbayIDL };

// The programId is imported from the program IDL.
export const SOLBAY_PROGRAM_ID = new PublicKey(SolbayIDL.address);

// This is a helper function to get the Solbay Anchor program.
export function getSolbayProgram(
  provider: AnchorProvider,
  address?: PublicKey,
) {
  return new Program(
    {
      ...SolbayIDL,
      address: address ? address.toBase58() : SolbayIDL.address,
    } as Solbay,
    provider,
  );
}

// This is a helper function to get the program ID for the Solbay program depending on the cluster.
export function getSolbayProgramId(cluster: Cluster | 'localnet') {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'localnet':
      // This is the program ID for the Solbay program on devnet and testnet.
      return SOLBAY_PROGRAM_ID;
    case 'mainnet-beta':
    default:
      return SOLBAY_PROGRAM_ID;
  }
}
