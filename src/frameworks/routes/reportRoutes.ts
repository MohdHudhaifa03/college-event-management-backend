import { Router } from 'express';
import { ReportController } from '../../adapters/controller/ReportController';

export const reportRoutes = Router();
const controller = new ReportController();

reportRoutes.get('/summary', controller.getSummaryReport);
