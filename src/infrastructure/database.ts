import { DataSource } from 'typeorm';
import { config } from '../config/index';
import 'reflect-metadata';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: true, // Turned off in favor of real migrations
  logging: false, // Turned off to hide queries in terminal
  migrationsRun: true, // Auto-run migrations on server start
  entities: [
    __dirname + '/../adapters/models/*.{ts,js}'
  ],
  migrations: [
    __dirname + '/migrations/*.{ts,js}'
  ],
  subscribers: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization', err);
    process.exit(1);
  }
};
