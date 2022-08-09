import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
  @Get()
  @Public()
  welcome() {
    return "Welcome to API of Festiv'App project.";
  }
}
