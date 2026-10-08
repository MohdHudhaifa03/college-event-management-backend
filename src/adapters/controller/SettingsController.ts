import { Request, Response, NextFunction } from 'express';
import { GetSettingsUseCase, UpdateSettingsUseCase } from '../../application/usecases/settings/SettingsUseCases';
import { SettingsImpl } from '../repositories/SettingsImpl';

export class SettingsController {
  private getSett: GetSettingsUseCase;
  private updateSett: UpdateSettingsUseCase;

  constructor() {
    const repo = new SettingsImpl();
    this.getSett = new GetSettingsUseCase(repo);
    this.updateSett = new UpdateSettingsUseCase(repo);
  }

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getSett.execute();
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.updateSett.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };
}
