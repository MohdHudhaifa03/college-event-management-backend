import { Request, Response, NextFunction } from 'express';
import {
  CreateRegistrationUseCase,
  GetRegistrationsUseCase,
  UpdateRegistrationStatusUseCase,
  BulkUpdateRegistrationStatusUseCase,
  UpdateAttendanceUseCase,
  BulkUpdateAttendanceUseCase,
  UpdateResultsUseCase,
  GenerateCertificatesUseCase,
  RevokeCertificateUseCase
} from '../../application/usecases/registrations/RegistrationUseCases';
import { RegistrationImpl } from '../repositories/RegistrationImpl';
import { EventImpl } from '../repositories/EventImpl';

export class RegistrationController {
  private createReg: CreateRegistrationUseCase;
  private getRegs: GetRegistrationsUseCase;
  private updateStatus: UpdateRegistrationStatusUseCase;
  private bulkStatus: BulkUpdateRegistrationStatusUseCase;
  private updateAtt: UpdateAttendanceUseCase;
  private bulkAtt: BulkUpdateAttendanceUseCase;
  private updateRes: UpdateResultsUseCase;
  private genCerts: GenerateCertificatesUseCase;
  private revokeCert: RevokeCertificateUseCase;

  constructor() {
    const regRepo = new RegistrationImpl();
    const eventRepo = new EventImpl();
    this.createReg = new CreateRegistrationUseCase(regRepo, eventRepo);
    this.getRegs = new GetRegistrationsUseCase(regRepo);
    this.updateStatus = new UpdateRegistrationStatusUseCase(regRepo);
    this.bulkStatus = new BulkUpdateRegistrationStatusUseCase(regRepo);
    this.updateAtt = new UpdateAttendanceUseCase(regRepo);
    this.bulkAtt = new BulkUpdateAttendanceUseCase(regRepo);
    this.updateRes = new UpdateResultsUseCase(regRepo, eventRepo);
    this.genCerts = new GenerateCertificatesUseCase(regRepo);
    this.revokeCert = new RevokeCertificateUseCase(regRepo);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = req.body.studentId || req.user?.id;
      const result = await this.createReg.execute(req.body.eventId, studentId);
      res.status(201).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getRegs.execute(req.query as any);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  updateStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.updateStatus.execute(req.params.id as string, req.body.status);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  bulkUpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bulkStatus.execute(req.body.ids, req.body.status);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.updateAtt.execute(req.params.id as string, req.body.attendance);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  bulkAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bulkAtt.execute(req.body.updates);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  updateResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.updateRes.execute(req.params.eventId as string, req.body.positions, req.body.notes);
      res.status(200).json({ success: true, message: 'Results published' });
    } catch (e) { next(e); }
  };

  generateCerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.genCerts.execute(req.body.eventId);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  revokeCertHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.revokeCert.execute(req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };
}
