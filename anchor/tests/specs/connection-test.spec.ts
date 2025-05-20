import { Connection } from '@solana/web3.js';

import { Solbay } from '../../target/types/solbay';
import { ProgramUtil } from '../utils/program.util';

describe.skip('Sample Test', () => {
  let connection: Connection;

  beforeAll(() => {
    const programUtil = new ProgramUtil<Solbay>();

    const provider = programUtil.getProvider();
    connection = provider.connection;
  }, 30000);

  it('test connection', async () => {
    const blockhashObj = await connection.getLatestBlockhash();

    expect(blockhashObj).not.toBeUndefined();
  });
});
