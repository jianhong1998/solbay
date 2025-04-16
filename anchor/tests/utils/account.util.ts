import { SYSTEM_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/native/system';
import { Keypair, PublicKey } from '@solana/web3.js';
import { AccountInfoBytes, AddedAccount } from 'solana-bankrun';
import { FileUtil } from './file.util';

export class AccountUtil {
  private constructor() {}

  public static createAddedAccount(
    address: PublicKey,
    partialInfo: Partial<AccountInfoBytes>,
  ): AddedAccount {
    return {
      address,
      info: {
        data: Buffer.alloc(0),
        executable: false,
        lamports: 0,
        owner: SYSTEM_PROGRAM_ID,
        ...partialInfo,
      },
    };
  }

  public static async getAccount(filePath?: string) {
    if (!filePath) {
      return new Keypair();
    }

    const isFileExist = FileUtil.isFileExist(filePath);

    if (!isFileExist) {
      console.warn(`File ${filePath} does not exist, creating a new keypair.`);
      return new Keypair();
    }

    const secretKeyFileContent = await FileUtil.readFile(filePath);
    const secretKeyArray = Uint8Array.from(JSON.parse(secretKeyFileContent));

    return Keypair.fromSecretKey(secretKeyArray);
  }
}
