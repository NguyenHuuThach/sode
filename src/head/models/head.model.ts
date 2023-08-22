import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { WebsCrawl } from 'src/constants/website';
import { MienVietNam, TinhThanh } from 'src/constants/zone';

export type HeadDocument = HydratedDocument<Head>;

@Schema({ timestamps: true })
export class Head {
  @Prop({
    trim: true,
    min: 0,
    max: 99,
    required: true,
  })
  value: number;

  @Prop({
    trim: true,
    maxLength: 30,
    required: true,
  })
  date: string;

  @Prop({
    required: true,
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

export const HeadSchema = SchemaFactory.createForClass(Head);
HeadSchema.index(
  {
    channel: 1,
    value: 1,
    date: 1,
  },
  { unique: true },
);
