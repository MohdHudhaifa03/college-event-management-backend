import { Request, Response, NextFunction } from 'express';
import {
  CreateEventRequestUseCase,
  GetEventRequestsUseCase,
  ApproveEventRequestUseCase,
  RejectEventRequestUseCase
} from '../../application/usecases/eventRequests/EventRequestUseCases';
import { EventRequestImpl } from '../repositories/EventRequestImpl';
import { EventImpl } from '../repositories/EventImpl';

export class EventRequestController {
  private createReq: CreateEventRequestUseCase;
  private getReqs: GetEventRequestsUseCase;
  private approveReq: ApproveEventRequestUseCase;
  private rejectReq: RejectEventRequestUseCase;

  constructor() {
    const reqRepo = new EventRequestImpl();
    const eventRepo = new EventImpl();
    this.createReq = new CreateEventRequestUseCase(reqRepo);
    this.getReqs = new GetEventRequestsUseCase(reqRepo);
    this.approveReq = new ApproveEventRequestUseCase(reqRepo, eventRepo);
    this.rejectReq = new RejectEventRequestUseCase(reqRepo);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = {
        ...req.body,
        userId: req.user?.id || req.body.coordinator || req.body.userId,
        proposedDate: req.body.proposedDate || req.body.date,
        proposedTime: req.body.proposedTime || req.body.time
      };
      const result = await this.createReq.execute(data);
      res.status(201).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getReqs.execute(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  approve = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.approveReq.execute(req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.rejectReq.execute(req.params.id as string, req.body.reason);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };
}
