import { Controller, Get } from '@nestjs/common';
import { HeadService } from './head.service';
import { Head } from './models/head.model';

@Controller('head')
export class HeadController {
  constructor(private readonly headService: HeadService) {}

  @Get('ho-chi-minh')
  async getHoChiMinh(): Promise<Head> {
    return await this.headService.getResultHoChiMinh();
  }

  @Get('aggregate/ho-chi-minh')
  async aggregateHoChiMinh(): Promise<any> {
    return await this.headService.aggregateHoChiMinh();
  }
}
