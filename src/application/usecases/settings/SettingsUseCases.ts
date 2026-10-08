import { ISettingsRepository } from '../../interfaces/ISettingsRepository';
import { CollegeSettings } from '../../../adapters/models/CollegeSettings';

export class GetSettingsUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}
  async execute() {
    let settings = await this.settingsRepository.get();
    if (!settings) {
      settings = new CollegeSettings();
      settings = await this.settingsRepository.save(settings);
    }
    return settings;
  }
}

export class UpdateSettingsUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}
  async execute(data: Partial<{ name: string; year: string; logo: string }>) {
    let settings = await this.settingsRepository.get();
    if (!settings) {
      settings = new CollegeSettings();
    }
    Object.assign(settings, data);
    return this.settingsRepository.save(settings);
  }
}
