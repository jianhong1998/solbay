import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators';

import { ExampleService } from '../services/example.service';

@Controller('/example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('/')
  @Public()
  public async getSignerBalance(): Promise<{ balance: number }> {
    const balance = await this.exampleService.getFeePayerBalance();

    return { balance };
  }
}
