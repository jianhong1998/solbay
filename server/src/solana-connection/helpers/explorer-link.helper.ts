import { PublicKey } from '@solana/web3.js';
import { getExplorerLink } from '@solana-developers/helpers';

import { ClusterType } from '../cluster.type';
import { ConnectionUtil } from '../utils/connection.util';

export class ExplorerLinkHelper {
  public static self: ExplorerLinkHelper;

  private constructor(public readonly clusterType: ClusterType) {}

  public static getTransactionUrl(transactionId: string): string {
    const cluster = this.getSelf().clusterType;

    return getExplorerLink('transaction', transactionId, cluster);
  }

  public static getAccountUrl(publicKey: PublicKey) {
    const cluster = this.getSelf().clusterType;

    return getExplorerLink('address', publicKey.toBase58(), cluster);
  }

  private static getSelf(): ExplorerLinkHelper {
    if (!this.self)
      this.self = new ExplorerLinkHelper(ConnectionUtil.getClusterType());

    return this.self;
  }
}
