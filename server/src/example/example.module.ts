import { Module } from '@nestjs/common';

import { ExampleController } from './controllers/example.controller';
import { ExampleService } from './services/example.service';

@Module({
  imports: [],
  providers: [ExampleService],
  controllers: [ExampleController],
  exports: [ExampleService],
})
export class ExampleModule {}
