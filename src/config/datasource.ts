import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.${process.env.NODE_ENV.trim()}.env`,
});

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port : configService.get('PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/../migrations/*{.ts,.js}'],
    synchronize: true,
    migrationsRun: true,
    logging: false,
}

export const envData = {
    jwtSecret: configService.get('JWT_SECRET'),
    database_url: configService.get('DATABASE_URL'),
    port: configService.get('PORT'),
    host : configService.get('DB_HOST'),
}

export const AppOS = new DataSource(DataSourceConfig)