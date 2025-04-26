import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  public healthCheck(): boolean {
    return true;
  }

  public getVersion(): { version: string } {
    const version = this.configService.get('VERSION');

    return {
      version: version ?? '-',
    };
  }
}
