// apps/backend/src/history/history.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  logActivity(
    @Body()
    activityDto: {
      userId: string;
      siteId?: string;
      action: 'visit' | 'search';
      query?: string;
    },
  ) {
    return this.historyService.logActivity(activityDto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.historyService.findByUser(userId);
  }
}
