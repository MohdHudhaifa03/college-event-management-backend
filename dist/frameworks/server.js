"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("../infrastructure/database");
const index_1 = require("../config/index");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'College Event Management API is running' });
});
const routes_1 = require("./routes");
const middleware_1 = require("./middleware");
app.use('/api', routes_1.routes);
app.use(middleware_1.errorMiddleware);
const startServer = async () => {
    await (0, database_1.initializeDatabase)();
    app.listen(index_1.config.port, () => {
        console.log(`Server is running on port ${index_1.config.port}`);
    });
};
startServer();
