import { DataSource, DataSourceOptions } from 'typeorm';
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
  migrations: ['dist/../migrations/*{.ts,.js}'],
  synchronize: true,
  migrationsRun: true,
  logging: false,
};

export const envData = {
  JWTSECRET: configService.get('JWT_SECRET'),
  BACKEND_BASE_URL: configService.get('BACKEND_BASE_URL'),
  DB_PORT: configService.get('DB_PORT'),
};

export const AppOS = new DataSource(DataSourceConfig);
