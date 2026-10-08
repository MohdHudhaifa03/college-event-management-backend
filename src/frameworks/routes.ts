import { Router } from 'express';
import { authRoutes } from './routes/authRoutes';
import { eventRoutes } from './routes/eventRoutes';
import { userRoutes } from './routes/userRoutes';
import { registrationRoutes } from './routes/registrationRoutes';
import { eventRequestRoutes } from './routes/eventRequestRoutes';
import { categoryRoutes } from './routes/categoryRoutes';
import { feedbackRoutes } from './routes/feedbackRoutes';
import { notificationRoutes } from './routes/notificationRoutes';
import { settingsRoutes } from './routes/settingsRoutes';
import { reportRoutes } from './routes/reportRoutes';
import { authMiddleware } from './middleware';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/events', authMiddleware, eventRoutes);
routes.use('/users', authMiddleware, userRoutes);
routes.use('/registrations', authMiddleware, registrationRoutes);
routes.use('/event-requests', authMiddleware, eventRequestRoutes);
routes.use('/categories', authMiddleware, categoryRoutes);
routes.use('/feedback', authMiddleware, feedbackRoutes);
routes.use('/notifications', authMiddleware, notificationRoutes);
routes.use('/settings', authMiddleware, settingsRoutes);
routes.use('/reports', authMiddleware, reportRoutes);

routes.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});
