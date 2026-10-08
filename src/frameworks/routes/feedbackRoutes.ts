import { Router } from 'express';
import { FeedbackController } from '../../adapters/controller/FeedbackController';

export const feedbackRoutes = Router();
const controller = new FeedbackController();

feedbackRoutes.get('/', controller.getAll);
feedbackRoutes.post('/', controller.create);
