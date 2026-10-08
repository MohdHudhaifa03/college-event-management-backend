"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = void 0;
const express_1 = require("express");
const EventController_1 = require("../../adapters/controller/EventController");
exports.eventRoutes = (0, express_1.Router)();
const eventController = new EventController_1.EventController();
exports.eventRoutes.get('/', eventController.getAllEvents);
