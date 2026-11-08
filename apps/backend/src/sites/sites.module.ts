import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './sites.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
  ],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
