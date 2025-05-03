import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export class NumberDisplayHelper {
  private constructor() {}

  public static convertLamportToSol(lamport: number): number {
    return lamport / LAMPORTS_PER_SOL;
  }

  public static convertSolToLamport(sol: number): number {
    return sol * LAMPORTS_PER_SOL;
  }
}
