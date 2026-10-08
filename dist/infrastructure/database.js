"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("../config/index");
require("reflect-metadata");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: index_1.config.dbHost,
    port: index_1.config.dbPort,
    username: index_1.config.dbUser,
    password: index_1.config.dbPassword,
    database: index_1.config.dbName,
    synchronize: true, // Auto-create tables (turn off in production)
    logging: true,
    entities: [
        __dirname + '/../adapters/models/*.{ts,js}'
    ],
    migrations: [],
    subscribers: [],
});
const initializeDatabase = async () => {
    try {
        await exports.AppDataSource.initialize();
        console.log('Data Source has been initialized!');
    }
    catch (err) {
        console.error('Error during Data Source initialization', err);
        process.exit(1);
    }
};
exports.initializeDatabase = initializeDatabase;
