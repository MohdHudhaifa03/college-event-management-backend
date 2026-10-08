import { Router } from 'express';
import { EventCrudController } from '../../adapters/controller/EventCrudController';

export const eventRoutes = Router();
const controller = new EventCrudController();

eventRoutes.get('/', controller.getAll);
eventRoutes.get('/:id', controller.getById);
eventRoutes.post('/', controller.create);
eventRoutes.put('/:id', controller.update);
eventRoutes.delete('/:id', controller.delete);
