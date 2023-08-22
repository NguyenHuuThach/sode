import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { WebsCrawl } from 'src/constants/website';
import { MienVietNam, TinhThanh } from 'src/constants/zone';

export type HeadResultDocument = HydratedDocument<HeadResult>;

@Schema({ timestamps: true })
export class HeadResult {
  @Prop({
    required: true,
    default: 0,
  })
  profitLossTop: number;

  @Prop({
    required: true,
    default: 0,
  })
  profitLossBottom: number;

  @Prop({
    required: true,
    unique: true,
    enum: TinhThanh,
  })
  channel: string;

  @Prop({
    required: true,
    enum: WebsCrawl,
  })
  source: string;

  @Prop({
    required: true,
    enum: MienVietNam,
  })
  zone: string;
}

export const HeadResultSchema = SchemaFactory.createForClass(HeadResult);
