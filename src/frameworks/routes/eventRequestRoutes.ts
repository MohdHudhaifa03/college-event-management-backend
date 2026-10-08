import { Router } from 'express';
import { EventRequestController } from '../../adapters/controller/EventRequestController';

export const eventRequestRoutes = Router();
const controller = new EventRequestController();

eventRequestRoutes.post('/', controller.create);
eventRequestRoutes.get('/', controller.getAll);
eventRequestRoutes.put('/:id/approve', controller.approve);
eventRequestRoutes.put('/:id/reject', controller.reject);
