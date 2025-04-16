import { Program } from '@coral-xyz/anchor';
import { Injectable } from '@nestjs/common';
import { Connection, Keypair } from '@solana/web3.js';
import { Solbay } from 'src/contract/src';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';

@Injectable()
export class ExampleService {
  private connection: Connection;
  private program: Program<Solbay>;
  private feePayerKeypair: Keypair;

  constructor() {
    this.connection = ConnectionUtil.getConnection();
    this.feePayerKeypair = ConnectionUtil.getSigner();
    this.program = ConnectionUtil.getProgram();
  }

  public async getFeePayerBalance(): Promise<number> {
    const publicKey = this.feePayerKeypair.publicKey;

    const balance = await this.connection.getBalance(publicKey);

    return balance;
  }

  public async getAllAccounts() {
    const accounts = await this.program.account.solbay.all();

    return accounts;
  }
}
