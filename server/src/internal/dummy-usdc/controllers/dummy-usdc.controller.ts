import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { Public } from 'src/common/decorators';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { ClusterType } from 'src/solana-connection/cluster.type';
import { ExplorerLinkHelper } from 'src/solana-connection/helpers/explorer-link.helper';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';

import { AirdropUsdcReqDTO, AirdropUsdcResDTO } from '../dtos/airdrop-usdc.dto';
import { DummyUsdcService } from '../services/dummy-usdc.service';

@Controller('/internal/dummy-usdc')
export class DummyUsdcController {
  private readonly clusterType: ClusterType;

  constructor(
    private readonly dummyUsdcService: DummyUsdcService,
    private readonly loggerUtil: LoggerUtil,
  ) {
    this.clusterType = ConnectionUtil.getClusterType();
  }

  @Post('/')
  @Public()
  public async initUsdc() {
    if (this.clusterType === 'mainnet-beta')
      throw new BadRequestException(
        'This endpoint cannot be called on mainnet',
      );

    const usdcMintPubkey = await this.dummyUsdcService.initUsdc();
    const usdcLink = ExplorerLinkHelper.getAccountUrl(usdcMintPubkey);

    return { usdc: usdcLink };
  }

  @Post('/airdrop')
  @Public()
  public async airdropUsdc(
    @Body() reqBody: AirdropUsdcReqDTO,
  ): Promise<AirdropUsdcResDTO> {
    const logger = this.loggerUtil.createLogger('Airdrop USDC');

    if (this.clusterType === 'mainnet-beta')
      throw new BadRequestException(
        'This endpoint cannot be called on mainnet',
      );

    const { amount, recipient: recipientPublicKeyString } = reqBody;

    let recipientPublicKey: PublicKey;

    try {
      recipientPublicKey = new PublicKey(recipientPublicKeyString);
    } catch (error) {
      logger.error(error);
      throw new BadRequestException(
        `Invalid recipient public key: ${recipientPublicKeyString}`,
      );
    }

    const { balance, publicKey } = await this.dummyUsdcService.airdropUsdc({
      publicKey: recipientPublicKey,
      amount,
    });

    return new AirdropUsdcResDTO(publicKey, balance);
  }
}
