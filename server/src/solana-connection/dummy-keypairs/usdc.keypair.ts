import { Keypair } from '@solana/web3.js';

import { ConnectionUtil } from '../utils/connection.util';

export class DummyUsdcKeypairGenerator {
  private static self: DummyUsdcKeypairGenerator;

  private constructor(
    public readonly usdcMintKeypair: Keypair,
    public readonly usdcAuthorityKeypair: Keypair,
  ) {}

  public static getUsdcMintKeypair(): Keypair {
    const self = this.getSelf();
    return self.usdcMintKeypair;
  }

  public static getUsdcAuthorityKeypair(): Keypair {
    const self = this.getSelf();
    return self.usdcAuthorityKeypair;
  }

  private static getSelf(): DummyUsdcKeypairGenerator {
    const clusterType = ConnectionUtil.getClusterType();

    if (clusterType === 'mainnet-beta') {
      throw new Error(
        'Dummy USDC can only be used in localnet, devnet and testnet',
      );
    }

    if (!this.self) {
      const usdcMintKey = [
        191, 224, 60, 182, 145, 175, 106, 220, 114, 199, 39, 130, 86, 230, 132,
        197, 17, 28, 145, 217, 159, 169, 57, 212, 23, 81, 164, 115, 51, 50, 43,
        179, 201, 194, 198, 247, 148, 212, 90, 140, 29, 185, 124, 241, 112, 169,
        183, 102, 92, 251, 211, 88, 30, 137, 216, 228, 212, 83, 250, 230, 186,
        93, 208, 220,
      ];

      const usdcAuthorityKey = [
        104, 137, 88, 171, 198, 3, 124, 250, 195, 116, 220, 113, 40, 240, 120,
        86, 67, 204, 23, 249, 253, 142, 88, 0, 240, 108, 247, 210, 137, 69, 244,
        42, 216, 74, 73, 226, 177, 234, 239, 232, 134, 2, 118, 47, 205, 173, 20,
        226, 70, 148, 11, 120, 114, 123, 9, 195, 106, 112, 179, 160, 173, 8,
        197, 182,
      ];

      this.self = new DummyUsdcKeypairGenerator(
        Keypair.fromSecretKey(Uint8Array.from(usdcMintKey)),
        Keypair.fromSecretKey(Uint8Array.from(usdcAuthorityKey)),
      );
    }

    return this.self;
  }
}
