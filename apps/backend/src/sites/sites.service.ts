import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Site, SiteDocument } from './sites.schema';
import { Model } from 'mongoose';

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private siteModel: Model<SiteDocument>) {}
  // publish
  async create(createSiteDto: { url: string; title: string; rawHtml: string }) {
    const newSite = new this.siteModel(createSiteDto);
    return newSite.save();
  }

  // find by url
  async findByUrl(url: string) {
    const site = await this.siteModel.findOne({ url }).exec();
    if (!site) {
      throw new NotFoundException('Nowhere: No such address found');
    }
    return site;
  }

  async search(query: string) {
    return this.siteModel
      .find({ $text: { $search: query } })
      .select({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .exec();
  }
}
