import { Router } from 'express';
import { NotificationController } from '../../adapters/controller/NotificationController';

export const notificationRoutes = Router();
const controller = new NotificationController();

notificationRoutes.get('/', controller.getMyNotifications);
notificationRoutes.post('/', controller.create);
notificationRoutes.put('/:id/read', controller.markAsRead);
