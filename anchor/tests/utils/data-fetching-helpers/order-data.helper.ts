import { PublicKey } from '@solana/web3.js';
import { UUID } from 'crypto';
import { parse } from 'uuid';

export class OrderDataFetchHelper {
  private constructor() {}

  public static getOrderPublicKey(params: {
    orderId: UUID;
    platformCode: string;
    programPublicKey: PublicKey;
  }): PublicKey {
    const { orderId, platformCode, programPublicKey } = params;

    const orderSeedBytes = Buffer.from('order');
    const uuidBytes = Buffer.from(parse(orderId));
    const platformCodeBytes = Buffer.from(platformCode);

    const [orderPublickey] = PublicKey.findProgramAddressSync(
      [orderSeedBytes, uuidBytes, platformCodeBytes],
      programPublicKey,
    );

    return orderPublickey;
  }
}
