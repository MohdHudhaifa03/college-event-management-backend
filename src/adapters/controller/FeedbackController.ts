import { Request, Response, NextFunction } from 'express';
import { CreateFeedbackUseCase, GetFeedbackUseCase } from '../../application/usecases/feedback/FeedbackUseCases';
import { FeedbackImpl } from '../repositories/FeedbackImpl';
import { RegistrationImpl } from '../repositories/RegistrationImpl';

export class FeedbackController {
  private createFb: CreateFeedbackUseCase;
  private getFb: GetFeedbackUseCase;

  constructor() {
    const fbRepo = new FeedbackImpl();
    const regRepo = new RegistrationImpl();
    this.createFb = new CreateFeedbackUseCase(fbRepo, regRepo);
    this.getFb = new GetFeedbackUseCase(fbRepo);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = req.user?.id || req.body.studentId;
      const result = await this.createFb.execute({ ...req.body, studentId });
      res.status(201).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getFb.execute(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };
}
