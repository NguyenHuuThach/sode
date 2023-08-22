import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

import { Head, HeadDocument } from './models/head.model';
import { HeadResult, HeadResultDocument } from './models/head-result.model';

@Injectable()
export class HeadService {
  constructor(
    @InjectModel(Head.name) private headModel: Model<HeadDocument>,
    @InjectModel(HeadResult.name)
    private headResultModel: Model<HeadResultDocument>,
  ) {}

  async createHead(data): Promise<Head> {
    const createdHead = new this.headModel(data);
    return await createdHead.save();
  }

  async updateHeadResultProfitLoss(
    filter: { channel: string },
    data: {
      profitLossTop: number;
      profitLossBottom: number;
    },
  ): Promise<Head> {
    const update = {
      $inc: data,
    };
    const options = { upsert: true, new: true };

    return await this.headResultModel.findOneAndUpdate(filter, update, options);
  }

  async aggregateHoChiMinh(): Promise<{
    top: Array<{ _id: number; totalAppearanceAmount: number }>;
    bottom: Array<{ _id: number; totalAppearanceAmount: number }>;
  }> {
    const analyzeList = await this.headModel.aggregate([
      {
        $match: { channel: 'Hồ Chí Minh' },
      },
      {
        $group: {
          _id: '$value',
          totalAppearanceAmount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: { totalAppearanceAmount: -1 },
      },
    ]);

    const top = analyzeList.slice(0, 49);
    const bottom = analyzeList.slice(50, 100);

    return { top, bottom };
  }

  async findLastDateHoChiMinh(): Promise<Head> {
    return await this.headModel
      .findOne({
        channel: 'Hồ Chí Minh',
      })
      .sort({ date: 'desc' });
  }

  async getResultHoChiMinh(): Promise<Head> {
    return await this.headResultModel.findOne({
      channel: 'Hồ Chí Minh',
    });
  }
}
