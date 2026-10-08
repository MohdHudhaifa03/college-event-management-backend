"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventImpl = void 0;
const database_1 = require("../../infrastructure/database");
const Event_1 = require("../models/Event");
class EventImpl {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(Event_1.Event);
    }
    async findById(id) {
        return this.repository.findOne({ where: { id }, relations: { organizer: true } });
    }
    async findAll() {
        return this.repository.find({ relations: { organizer: true } });
    }
    async save(event) {
        return this.repository.save(event);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
}
exports.EventImpl = EventImpl;
