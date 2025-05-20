import { SYSTEM_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/native/system';
import { Keypair, PublicKey } from '@solana/web3.js';
import { join } from 'path';
import { AccountInfoBytes, AddedAccount } from 'solana-bankrun';

import { Seeds } from '../constants';
import { FileUtil } from './file.util';
import { ProgramUtil } from './program.util';

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

  public static getAccount(filePath?: string) {
    if (!filePath) {
      return new Keypair();
    }

    const isFileExist = FileUtil.isFileExist(filePath);

    if (!isFileExist) {
      console.warn(`File ${filePath} does not exist, creating a new keypair.`);
      return new Keypair();
    }

    const secretKeyFileContent = FileUtil.readFile(filePath);
    const secretKeyArray = Uint8Array.from(
      JSON.parse(secretKeyFileContent) as number[],
    );

    return Keypair.fromSecretKey(secretKeyArray);
  }
}

export class ProgramAccountHelper {
  private static keypairPaths = {
    feePayer: join(__dirname, '../../../keypairs/fee-payer.json'),
    programOwner: join(__dirname, '../../../keypairs/program-owner.json'),
    buyer: join(__dirname, '../../../keypairs/test-buyer.json'),
    seller: join(__dirname, '../../../keypairs/test-seller.json'),
    usdcAuthority: join(
      __dirname,
      '../../../keypairs/test-usdc-authority.json',
    ),
    usdcMint: join(__dirname, '../../../keypairs/test-usdc-mint.json'),
  };

  private constructor() {}

  public static getAccountKeypair(accountName: keyof typeof this.keypairPaths) {
    return AccountUtil.getAccount(this.keypairPaths[accountName]);
  }

  public static getEscrowAccountPublicKey(
    mintPublicKey: PublicKey,
    account: 'escrow' | 'authority',
  ): PublicKey {
    const programUtil = new ProgramUtil();
    const program = programUtil.getProgram();

    let accountStaticSeed: Buffer;

    switch (account) {
      case 'authority':
        accountStaticSeed = Buffer.from(Seeds.escrowAuthority);
        break;
      case 'escrow':
        accountStaticSeed = Buffer.from(Seeds.escrowAccount);
        break;
      default:
        throw new Error('Invalid account');
    }

    const [publicKey] = PublicKey.findProgramAddressSync(
      [accountStaticSeed, mintPublicKey.toBuffer()],
      program.programId,
    );

    return publicKey;
  }
}
