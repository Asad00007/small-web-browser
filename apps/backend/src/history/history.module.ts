import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryLog, HistoryLogSchema } from './history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistoryLog.name, schema: HistoryLogSchema },
    ]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
