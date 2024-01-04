import { DataSource, DataSourceOptions, createConnection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [`.env`, `${process.env.NODE_ENV}.env`],
});

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
  type: configService.get('DB_TYPE') as any,
  host: configService.get('DB_HOST') as string,
  port: configService.get('PORT') as number,
  username: configService.get('DB_USER') as string,
  password: configService.get('DB_PASSWORD') as string,
  database: configService.get('DB_NAME') as string,
  entities: ['dist/**/*.entity.js'],
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: ['dist/config/migrations/*.ts'],
  subscribers: ['dist/config/subscribers/**/*.js'],
  synchronize: true,
  logging: false,
};

export const envData = {
  JWTSECRET: configService.get('JWT_SECRET'),
  BACKEND_BASE_URL: configService.get('BACKEND_BASE_URL'),
  DB_PORT: configService.get('DB_PORT'),
  MEILISEARCH: configService.get('MEILISEARCH_URL'),
  MEILISEARCH_KEY: configService.get('MEILISEARCH_KEY'),
  ELASTIC_URL: configService.get('ELASTIC_URL'),
  ELASTIC_USER: configService.get('ELASTIC_USER'),
  ELASTIC_PASSWORD: configService.get('ELASTIC_PASSWORD'),
  API_COUNTRY_KEY: configService.get('API_COUNTRY_KEY'),
  API_BANNER_URL: configService.get('API_BANNER_URL'),
};

export const AppOS = new DataSource(DataSourceConfig);
