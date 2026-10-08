import { Router } from 'express';
import { CategoryController } from '../../adapters/controller/CategoryController';

export const categoryRoutes = Router();
const controller = new CategoryController();

categoryRoutes.get('/', controller.getAll);
categoryRoutes.post('/', controller.create);
categoryRoutes.put('/:id', controller.update);
categoryRoutes.delete('/:id', controller.delete);
