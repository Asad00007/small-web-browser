import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HistoryLogDocument = HistoryLog & Document;

@Schema()
export class HistoryLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Site', required: false })
  siteId?: Types.ObjectId;

  @Prop({ required: true, enum: ['visit', 'search'] })
  action: 'visit' | 'search';

  @Prop({ required: false })
  query?: string;

  @Prop({ required: true, index: true })
  timestamp: Date;
}

export const HistoryLogSchema = SchemaFactory.createForClass(HistoryLog);
