import { Router } from 'express';
import { UserCrudController } from '../../adapters/controller/UserCrudController';

export const userRoutes = Router();
const controller = new UserCrudController();

userRoutes.get('/', controller.getAll);
userRoutes.get('/:id', controller.getById);
userRoutes.post('/', controller.create);
userRoutes.put('/:id', controller.update);
userRoutes.delete('/:id', controller.delete);
userRoutes.put('/:id/password', controller.changePassword);
userRoutes.put('/:id/toggle-active', controller.toggleActiveState);
