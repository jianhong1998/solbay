import { Keypair, PublicKey } from '@solana/web3.js';
import { USDC_MINT_PUBLICK_KEY_MAINNET } from 'src/common/constants/public-key.constant';

import { ClusterType } from '../cluster.type';
import { DummyUsdcKeypairGenerator } from '../dummy-keypairs/usdc.keypair';
import { ConnectionUtil } from '../utils/connection.util';

export class UsdcHelper {
  public readonly dummyUsdcKeypair: Keypair;

  private static self: UsdcHelper;

  private constructor(public readonly clusterType: ClusterType) {}

  public static getUsdcMint(): PublicKey {
    const self = this.getSelf();

    switch (self.clusterType) {
      case 'mainnet-beta':
        return USDC_MINT_PUBLICK_KEY_MAINNET;
      case 'devnet':
      case 'testnet':
      case 'localnet':
      default:
        return DummyUsdcKeypairGenerator.getUsdcMintKeypair().publicKey;
    }
  }

  /**
   * Get Dummy USDC mint authority.
   * @throw Error if call this with connecting to mainnet
   */
  public static getUsdcMintAuthority(): Keypair {
    const self = this.getSelf();

    switch (self.clusterType) {
      case 'mainnet-beta':
        throw new Error('Cannot get Dummy USDC mint authority on Mainnet');
      default:
        return DummyUsdcKeypairGenerator.getUsdcAuthorityKeypair();
    }
  }

  private static getSelf(): UsdcHelper {
    if (!this.self) {
      const cluster = ConnectionUtil.getClusterType();
      this.self = new UsdcHelper(cluster);
    }

    return this.self;
  }
}
