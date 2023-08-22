import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import cheerio from 'cheerio';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

import {
  XOSO_CONGDONG_DATE_FORMAT,
  XOSO_CONGDONG_DATE_BEGIN,
} from 'src/constants/format';
import { Cron } from '@nestjs/schedule';
import { EVERYDAY_AT_7PM, EVERYDAY_AT_6PM } from 'src/constants/cron';
import { TARGET_EVERYDAY } from 'src/constants/target';
import { HeadService } from 'src/head/head.service';

@Injectable()
export class XoSoCongDongJob {
  constructor(
    private readonly httpService: HttpService,
    private readonly headService: HeadService,
  ) {}

  @Cron(EVERYDAY_AT_6PM)
  async crawlHeadHoChiMinh(): Promise<void> {
    const last = await this.headService.findLastDateHoChiMinh();

    // const result = Array.from({ length: 100 }, (_, index) => ({ [index]: 0 }));
    const urls = [];
    // const promises = [];
    let date = last
      ? dayjs(last.date).add(1, 'day')
      : dayjs(XOSO_CONGDONG_DATE_BEGIN);

    while (dayjs(date).isSameOrBefore(dayjs())) {
      urls.push(
        `https://xoso.congdong.vn/xshcm-kqxshcm-ket-qua-xo-so-tp-hcm/ngay-${date.format(
          XOSO_CONGDONG_DATE_FORMAT,
        )}.html`,
      );

      // promises.push(
      //   await this.httpService.axiosRef.get(
      //     `https://xoso.congdong.vn/xshcm-kqxshcm-ket-qua-xo-so-tp-hcm/ngay-${date.format(
      //       XOSO_CONGDONG_DATE_FORMAT,
      //     )}.html`,
      //   ),
      // );

      date = date.add(1, 'day');
    }

    try {
      // for (const url of urls) {
      //   promises.push(await this.httpService.axiosRef.get(url));
      // }

      // const responses = await Promise.all([...promises]);

      // responses.forEach((res, i) => {
      //   const $ = cheerio.load(res.data);

      //   const textWebDate = $('.m2400.m0880 h2').first().text();
      //   const webDate = textWebDate
      //     .slice(textWebDate.lastIndexOf(' ') + 1)
      //     .split('/')
      //     .join('-');
      //   let giaiTam = undefined;
      //   if (urls[i].includes(webDate)) {
      //     giaiTam = $('.m2408 .m2409:contains("Giải tám") + .m2401 td')
      //       .first()
      //       .text();

      //     if (giaiTam) {
      //       result[Number(giaiTam)][Number(giaiTam).toString()] += 1;
      //     }
      //   }

      // });

      for (const url of urls) {
        const response = await this.httpService.axiosRef.get(url);
        const $ = cheerio.load(response.data);

        const textWebDate = $('.m2400.m0880 h2').first().text();
        const webDate = textWebDate
          .slice(textWebDate.lastIndexOf(' ') + 1)
          .split('/')
          .join('-');

        if (url.includes(webDate)) {
          const giaiTam = $('.m2408 .m2409:contains("Giải tám") + .m2401 td')
            .first()
            .text();

          if (giaiTam) {
            let convertWebDate: any = webDate.split('-');
            [convertWebDate[0], convertWebDate[2]] = [
              convertWebDate[2],
              convertWebDate[0],
            ];
            convertWebDate = convertWebDate.join('-');

            const head = {
              channel: 'Hồ Chí Minh',
              value: Number(giaiTam),
              date: convertWebDate,
              source: 'https://xoso.congdong.vn',
              zone: 'xsmn',
            };
            try {
              await this.headService.createHead(head);
            } catch (error) {}
          }
        }
      }
    } catch (error) {
      return error;
    }
  }

  @Cron(EVERYDAY_AT_7PM)
  async updateResultHoChiMinh(): Promise<void> {
    const last = await this.headService.findLastDateHoChiMinh();
    const { top, bottom } = await this.headService.aggregateHoChiMinh();

    if (last && top && bottom) {
      const value = last.value;

      const keysTop = top.map((e) => e._id);
      const keysBottom = bottom.map((e) => e._id);
      const profit = (TARGET_EVERYDAY / 50) * 70 - TARGET_EVERYDAY;

      if (keysTop.includes(value)) {
        const filter = {
          channel: 'Hồ Chí Minh',
        };

        const update = {
          profitLossTop: profit,
          profitLossBottom: -TARGET_EVERYDAY,
        };

        await this.headService.updateHeadResultProfitLoss(filter, update);
      }

      if (keysBottom.includes(value)) {
        const filter = {
          channel: 'Hồ Chí Minh',
        };

        const update = {
          profitLossTop: -TARGET_EVERYDAY,
          profitLossBottom: profit,
        };

        await this.headService.updateHeadResultProfitLoss(filter, update);
      }
    }
  }
}
