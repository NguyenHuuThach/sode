import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import cheerio from 'cheerio';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

@Injectable()
export class CrawlService {
  constructor() {}
}
