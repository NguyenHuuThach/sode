import { Module } from '@nestjs/common';
import { HeadService } from './head.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Head, HeadSchema } from './models/head.model';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { HeadResult, HeadResultSchema } from './models/head-result.model';
import { HeadController } from './head.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: Head.name, schema: HeadSchema }]),
    MongooseModule.forFeature([
      { name: HeadResult.name, schema: HeadResultSchema },
    ]),
    HttpModule,
  ],

  controllers: [HeadController],
  providers: [HeadService],
  exports: [HeadService],
})
export class HeadModule {}
