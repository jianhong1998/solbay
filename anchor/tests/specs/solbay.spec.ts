import { Connection } from '@solana/web3.js';
import { ProgramUtil } from '../utils/program.util';
import { Solbay } from '../../target/types/solbay';

describe('Sample Test', () => {
  let connection: Connection;

  beforeAll(async () => {
    const programUtil = new ProgramUtil<Solbay>();

    const provider = await programUtil.getProvider();
    connection = provider.connection;
  }, 30000);

  it('test connection', async () => {
    const blockhashObj = await connection.getLatestBlockhash();

    expect(blockhashObj).not.toBeUndefined();
  });
});
