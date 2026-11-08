// apps/backend/src/history/history.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HistoryLog, HistoryLogDocument } from './history.schema';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(HistoryLog.name)
    private historyModel: Model<HistoryLogDocument>,
  ) {}

  // 1. Record a live navigation step or query log
  async logActivity(data: {
    userId: string;
    siteId?: string;
    action: 'visit' | 'search';
    query?: string;
  }) {
    const log = new this.historyModel({
      userId: new Types.ObjectId(data.userId),
      siteId: data.siteId ? new Types.ObjectId(data.siteId) : undefined,
      action: data.action,
      query: data.query,
      timestamp: new Date(),
    });
    return log.save();
  }

  // 2. Fetch the scrollable per-person chronological history list
  async findByUser(userId: string) {
    return this.historyModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('siteId') // Merges website titles and info into the history list items
      .sort({ timestamp: -1 }) // Newest events show at the top
      .exec();
  }
}
