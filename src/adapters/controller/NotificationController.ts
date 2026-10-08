import { Request, Response, NextFunction } from 'express';
import {
  CreateNotificationUseCase,
  GetNotificationsUseCase,
  MarkNotificationReadUseCase
} from '../../application/usecases/notifications/NotificationUseCases';
import { NotificationImpl } from '../repositories/NotificationImpl';

export class NotificationController {
  private createNotif: CreateNotificationUseCase;
  private getNotifs: GetNotificationsUseCase;
  private markRead: MarkNotificationReadUseCase;

  constructor() {
    const repo = new NotificationImpl();
    this.createNotif = new CreateNotificationUseCase(repo);
    this.getNotifs = new GetNotificationsUseCase(repo);
    this.markRead = new MarkNotificationReadUseCase(repo);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.createNotif.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In real app, must come from req.user
      const userId = req.user?.id || req.query.userId as string;
      const role = req.user?.role || req.query.role as string;
      const result = await this.getNotifs.execute(userId, role);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || req.body.userId;
      await this.markRead.execute(req.params.id as string, userId as string);
      res.status(200).json({ success: true, message: 'Read' });
    } catch (e) { next(e); }
  };
}
