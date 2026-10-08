import { Router } from 'express';
import { RegistrationController } from '../../adapters/controller/RegistrationController';

export const registrationRoutes = Router();
const controller = new RegistrationController();

registrationRoutes.post('/', controller.create);
registrationRoutes.get('/', controller.getAll);
registrationRoutes.put('/:id/status', controller.updateStatusHandler);
registrationRoutes.put('/bulk-status', controller.bulkUpdateStatus);
registrationRoutes.put('/:id/attendance', controller.updateAttendance);
registrationRoutes.put('/bulk-attendance', controller.bulkAttendance);
registrationRoutes.put('/events/:eventId/results', controller.updateResults);
registrationRoutes.post('/generate-certificates', controller.generateCerts);
registrationRoutes.put('/:id/revoke-certificate', controller.revokeCertHandler);
