import { AppDataSource } from '../../infrastructure/database';
import { Feedback } from '../models/Feedback';
import { IFeedbackRepository } from '../../application/interfaces/IFeedbackRepository';

export class FeedbackImpl implements IFeedbackRepository {
  private repository = AppDataSource.getRepository(Feedback);

  async findById(id: string): Promise<Feedback | null> {
    return this.repository.findOne({ where: { id }, relations: { student: true, event: true } });
  }

  async findAll(filters?: { eventId?: string; studentId?: string }): Promise<Feedback[]> {
    const where: any = {};
    if (filters?.eventId) where.eventId = filters.eventId;
    if (filters?.studentId) where.studentId = filters.studentId;
    return this.repository.find({ where, relations: { student: true, event: true }, order: { createdAt: 'DESC' } });
  }

  async findByEventAndStudent(eventId: string, studentId: string): Promise<Feedback | null> {
    return this.repository.findOne({ where: { eventId, studentId } });
  }

  async save(feedback: Feedback): Promise<Feedback> {
    return this.repository.save(feedback);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByEventId(eventId: string): Promise<void> {
    await this.repository.delete({ eventId });
  }
}
