import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  public async healthCheck(): Promise<boolean> {
    return true;
  }

  public async getVersion(): Promise<{ version: string }> {
    const version = this.configService.get('VERSION');

    return {
      version: version ?? '-',
    };
  }
}
