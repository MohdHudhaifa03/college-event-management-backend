import { Notification } from '../../adapters/models/Notification';

export interface INotificationRepository {
  findById(id: string): Promise<Notification | null>;
  findForUser(userId: string, role: string): Promise<Notification[]>;
  save(notification: Notification): Promise<Notification>;
  markAsRead(id: string): Promise<void>;
}
