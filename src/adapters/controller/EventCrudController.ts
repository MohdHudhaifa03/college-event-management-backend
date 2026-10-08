import { Request, Response, NextFunction } from 'express';
import {
  GetEventByIdUseCase,
  CreateEventUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
  GetAllEventsUseCase
} from '../../application/usecases/events/index';
import { EventImpl } from '../repositories/EventImpl';
import { RegistrationImpl } from '../repositories/RegistrationImpl';
import { FeedbackImpl } from '../repositories/FeedbackImpl';

export class EventCrudController {
  private getAllEventsUseCase: GetAllEventsUseCase;
  private getEventByIdUseCase: GetEventByIdUseCase;
  private createEventUseCase: CreateEventUseCase;
  private updateEventUseCase: UpdateEventUseCase;
  private deleteEventUseCase: DeleteEventUseCase;

  constructor() {
    const eventRepo = new EventImpl();
    const regRepo = new RegistrationImpl();
    const fbRepo = new FeedbackImpl();
    
    this.getAllEventsUseCase = new GetAllEventsUseCase(eventRepo);
    this.getEventByIdUseCase = new GetEventByIdUseCase(eventRepo);
    this.createEventUseCase = new CreateEventUseCase(eventRepo);
    this.updateEventUseCase = new UpdateEventUseCase(eventRepo);
    this.deleteEventUseCase = new DeleteEventUseCase(eventRepo, regRepo, fbRepo);
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getAllEventsUseCase.execute(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getEventByIdUseCase.execute(req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = {
        ...req.body,
        coordinatorId: req.body.coordinator || req.body.coordinatorId,
      };
      const result = await this.createEventUseCase.execute(data);
      res.status(201).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = {
        ...req.body,
        coordinatorId: req.body.coordinator || req.body.coordinatorId,
      };
      const result = await this.updateEventUseCase.execute(req.params.id as string, data);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.deleteEventUseCase.execute(req.params.id as string);
      res.status(200).json({ success: true, message: 'Event deleted' });
    } catch (e) { next(e); }
  };
}
