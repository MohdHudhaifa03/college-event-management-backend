"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const GetAllEventsUseCase_1 = require("../../application/usecases/events/GetAllEventsUseCase");
const EventImpl_1 = require("../repositories/EventImpl");
class EventController {
    constructor() {
        this.getAllEvents = async (req, res, next) => {
            try {
                const events = await this.getAllEventsUseCase.execute();
                res.status(200).json({
                    success: true,
                    data: events
                });
            }
            catch (error) {
                next(error);
            }
        };
        const eventRepository = new EventImpl_1.EventImpl();
        this.getAllEventsUseCase = new GetAllEventsUseCase_1.GetAllEventsUseCase(eventRepository);
    }
}
exports.EventController = EventController;
