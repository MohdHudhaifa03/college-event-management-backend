import { Router } from 'express';
import { SettingsController } from '../../adapters/controller/SettingsController';

export const settingsRoutes = Router();
const controller = new SettingsController();

settingsRoutes.get('/', controller.get);
settingsRoutes.put('/', controller.update);
