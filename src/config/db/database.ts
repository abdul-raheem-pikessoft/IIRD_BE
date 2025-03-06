import { DataSource, DataSourceOptions } from 'typeorm';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DatabaseType } from 'typeorm/driver/types/DatabaseType';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DATABASE_TYPE as DatabaseType,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.js'],
  extra: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  dropSchema: false,
  logging: false,
  subscribers: [],
  migrations: ['dist/src/migrations/*.js'],
} as DataSourceOptions;
const database = new DataSource(dataSourceOptions);
export default database;
