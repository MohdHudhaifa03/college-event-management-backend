import { INotificationRepository } from '../../interfaces/INotificationRepository';
import { Notification } from '../../../adapters/models/Notification';
import { UserRole } from '../../../adapters/models/User';
import { AppError } from '../../../shared/error';

export class CreateNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}
  async execute(data: { role: UserRole; text: string; userId?: string }) {
    const notification = new Notification();
    Object.assign(notification, data);
    return this.notificationRepository.save(notification);
  }
}

export class GetNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}
  async execute(userId: string, role: string) {
    return this.notificationRepository.findForUser(userId, role);
  }
}

export class MarkNotificationReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}
  async execute(id: string, userId: string) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) throw new AppError('Notification not found', 404);
    
    // Quick ownership check - if it's a direct user notification, must be the owner. 
    // If it's a role broadcast, we technically need a read-receipt table per user, 
    // but for simplicity we'll just allow marking it read globally for this demo.
    if (notification.userId && notification.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }
    
    await this.notificationRepository.markAsRead(id);
  }
}
