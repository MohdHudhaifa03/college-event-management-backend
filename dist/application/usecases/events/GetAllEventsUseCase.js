"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllEventsUseCase = void 0;
class GetAllEventsUseCase {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async execute() {
        return this.eventRepository.findAll();
    }
}
exports.GetAllEventsUseCase = GetAllEventsUseCase;
