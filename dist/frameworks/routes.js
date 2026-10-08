"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const authRoutes_1 = require("./routes/authRoutes");
const eventRoutes_1 = require("./routes/eventRoutes");
const userRoutes_1 = require("./routes/userRoutes");
exports.routes = (0, express_1.Router)();
exports.routes.use('/auth', authRoutes_1.authRoutes);
exports.routes.use('/events', eventRoutes_1.eventRoutes);
exports.routes.use('/users', userRoutes_1.userRoutes);
exports.routes.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});
