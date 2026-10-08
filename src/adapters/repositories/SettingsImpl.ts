import { AppDataSource } from '../../infrastructure/database';
import { CollegeSettings } from '../models/CollegeSettings';
import { ISettingsRepository } from '../../application/interfaces/ISettingsRepository';

export class SettingsImpl implements ISettingsRepository {
  private repository = AppDataSource.getRepository(CollegeSettings);

  async get(): Promise<CollegeSettings | null> {
    const all = await this.repository.find({ take: 1 });
    return all[0] || null;
  }

  async save(settings: CollegeSettings): Promise<CollegeSettings> {
    return this.repository.save(settings);
  }
}
