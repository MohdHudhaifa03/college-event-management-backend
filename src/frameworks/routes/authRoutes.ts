import { Router } from 'express';
import { AuthController } from '../../adapters/controller/AuthController';
import { AuthRegisterController } from '../../adapters/controller/AuthRegisterController';

export const authRoutes = Router();
const authController = new AuthController();
const registrationController = new AuthRegisterController();

authRoutes.post('/login', authController.login);
authRoutes.post('/register', registrationController.register);
authRoutes.get('/me', authController.getMe);
authRoutes.post('/logout', authController.logout);
