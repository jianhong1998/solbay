import { Module } from '@nestjs/common';
import { ExampleService } from './services/example.service';
import { ExampleController } from './controllers/example.controller';

@Module({
  imports: [],
  providers: [ExampleService],
  controllers: [ExampleController],
  exports: [ExampleService],
})
export class ExampleModule {}
