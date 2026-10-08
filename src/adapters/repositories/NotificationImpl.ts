import { AppDataSource } from '../../infrastructure/database';
import { Notification } from '../models/Notification';
import { INotificationRepository } from '../../application/interfaces/INotificationRepository';
import { In } from 'typeorm';

export class NotificationImpl implements INotificationRepository {
  private repository = AppDataSource.getRepository(Notification);

  async findById(id: string): Promise<Notification | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findForUser(userId: string, role: string): Promise<Notification[]> {
    // Notifications targeted to a specific user OR to the user's role (broadcast)
    return this.repository
      .createQueryBuilder('n')
      .where('n.userId = :userId', { userId })
      .orWhere('(n.role = :role AND n.userId IS NULL)', { role })
      .orderBy('n.createdAt', 'DESC')
      .take(50)
      .getMany();
  }

  async save(notification: Notification): Promise<Notification> {
    return this.repository.save(notification);
  }

  async markAsRead(id: string): Promise<void> {
    await this.repository.update(id, { read: true });
  }
}
