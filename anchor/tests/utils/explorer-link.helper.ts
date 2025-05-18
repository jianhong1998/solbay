/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PublicKey } from '@solana/web3.js';
import { getExplorerLink } from '@solana-developers/helpers';

export class ExplorerLinkHelper {
  private constructor() {}

  public static getTransactionUrl(transactionId: string): string {
    return getExplorerLink('transaction', transactionId, 'localnet');
  }

  public static getAccountUrl(publicKey: PublicKey) {
    return getExplorerLink('address', publicKey.toBase58(), 'localnet');
  }
}
