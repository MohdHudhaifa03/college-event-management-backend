import { Request, Response, NextFunction } from 'express';
import { GetReportSummaryUseCase } from '../../application/usecases/reports/ReportUseCases';
import { EventImpl } from '../repositories/EventImpl';
import { RegistrationImpl } from '../repositories/RegistrationImpl';
import { FeedbackImpl } from '../repositories/FeedbackImpl';

export class ReportController {
  private getSummary: GetReportSummaryUseCase;

  constructor() {
    const eventRepo = new EventImpl();
    const regRepo = new RegistrationImpl();
    const fbRepo = new FeedbackImpl();
    this.getSummary = new GetReportSummaryUseCase(eventRepo, regRepo, fbRepo);
  }

  getSummaryReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coordinatorId = req.query.coordinatorId as string;
      const result = await this.getSummary.execute(coordinatorId);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };
}
