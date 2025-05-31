import { BadRequestException, Injectable } from '@nestjs/common';
import { getMint, Mint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { ClusterType } from 'src/solana-connection/cluster.type';
import { AccountHelper } from 'src/solana-connection/helpers/account.helper';
import { UsdcHelper } from 'src/solana-connection/helpers/usdc.helper';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';

import {
  IAirdropUsdcParams,
  IAirdropUsdcResult,
} from '../types/airdrop-usdc.type';

@Injectable()
export class DummyUsdcService {
  private readonly clusterType: ClusterType;
  private readonly connection: Connection;

  constructor() {
    this.clusterType = ConnectionUtil.getClusterType();
    this.connection = ConnectionUtil.getConnection();
  }

  public async initUsdc(): Promise<PublicKey> {
    if (this.clusterType === 'mainnet-beta')
      throw new Error('Cannot init dummy USDC on mainnet');

    await UsdcHelper.setupDummyUsdc();
    return UsdcHelper.getUsdcMint();
  }

  public async airdropUsdc(
    params: IAirdropUsdcParams,
  ): Promise<IAirdropUsdcResult> {
    if (this.clusterType === 'mainnet-beta')
      throw new Error('Cannot airdrop dummy USDC on mainnet');

    const { amount, publicKey } = params;

    const usdcMint = await this.getUsdcMint();

    const associatedTokenAccountPublicKey =
      AccountHelper.generateAssociatedTokenAccountPublicKey(
        publicKey,
        usdcMint.address,
      );

    const associatedTokenAccount = await AccountHelper.getTokenAccount(
      associatedTokenAccountPublicKey,
    );

    if (!associatedTokenAccount)
      throw new BadRequestException('Token account does not exist');

    const balance = await UsdcHelper.airdropDummyUsdc({
      recipient: associatedTokenAccount.address,
      amount: amount * 1_000_000,
    });

    return {
      balance,
      publicKey: associatedTokenAccount.address,
    };
  }

  public async getUsdcMint(): Promise<Mint> {
    const mintPublicKey = UsdcHelper.getUsdcMint();

    return await getMint(
      this.connection,
      mintPublicKey,
      'confirmed',
      TOKEN_PROGRAM_ID,
    );
  }
}
