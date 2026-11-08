import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteDocument = Site & Document;

@Schema({ timestamps: true })
export class Site {
  @Prop({ required: true, unique: true, index: true })
  url: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  rawHtml: string;
}

export const SiteSchema = SchemaFactory.createForClass(Site);

// Apply full-text indexing
SiteSchema.index({ title: 'text', rawHtml: 'text' });
