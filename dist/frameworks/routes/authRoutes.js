"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const AuthController_1 = require("../../adapters/controller/AuthController");
exports.authRoutes = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
exports.authRoutes.post('/login', authController.login);
