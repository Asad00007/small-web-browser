import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SitesService } from './sites.service';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  create(
    @Body() createSiteDto: { url: string; title: string; rawHtml: string },
  ) {
    return this.sitesService.create(createSiteDto);
  }

  @Get('browse')
  findByUrl(@Query('url') url: string) {
    return this.sitesService.findByUrl(url);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.sitesService.search(query);
  }
}
