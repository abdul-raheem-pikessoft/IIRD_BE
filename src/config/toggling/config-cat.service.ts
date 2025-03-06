import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

const configCat = require('configcat-node');

@Injectable()
export class ConfigCatService {
  private static readonly configCatClient = configCat.getClient(process.env.CONFIG_CAT_KEY);

  static async getFeatureStatus(key: string) {
    return await this.configCatClient.getValueAsync(key);
  }
}
