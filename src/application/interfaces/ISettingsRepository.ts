import { CollegeSettings } from '../../adapters/models/CollegeSettings';

export interface ISettingsRepository {
  get(): Promise<CollegeSettings | null>;
  save(settings: CollegeSettings): Promise<CollegeSettings>;
}
