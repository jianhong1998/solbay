import { Controller, Get } from '@nestjs/common';
import { ExampleService } from '../services/example.service';
import { Public } from 'src/common/decorators';

@Controller('/example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('/')
  @Public()
  public async getSignerBalance(): Promise<{ balance: number }> {
    const balance = await this.exampleService.getFeePayerBalance();

    return { balance };
  }

  @Get('/account')
  @Public()
  public async getAllAccounts() {
    return await this.exampleService.getAllAccounts();
  }
}
