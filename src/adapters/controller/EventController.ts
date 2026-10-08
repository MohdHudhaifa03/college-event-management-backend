import { Request, Response, NextFunction } from 'express';
import { GetAllEventsUseCase } from '../../application/usecases/events/GetAllEventsUseCase';
import { EventImpl } from '../repositories/EventImpl';

export class EventController {
  private getAllEventsUseCase: GetAllEventsUseCase;

  constructor() {
    const eventRepository = new EventImpl();
    this.getAllEventsUseCase = new GetAllEventsUseCase(eventRepository);
  }

  getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await this.getAllEventsUseCase.execute();
      
      res.status(200).json({
        success: true,
        data: events
      });
    } catch (error) {
      next(error);
    }
  };
}
