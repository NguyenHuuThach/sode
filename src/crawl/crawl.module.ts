import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

import { CrawlService } from './crawl.service';
import { HeadModule } from 'src/head/head.module';
import { XoSoCongDongJob } from './xosocongdong/xosocongdong.job';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule, HeadModule],
  controllers: [],
  providers: [CrawlService, XoSoCongDongJob],
  exports: [CrawlService, XoSoCongDongJob],
})
export class CrawlModule {}
