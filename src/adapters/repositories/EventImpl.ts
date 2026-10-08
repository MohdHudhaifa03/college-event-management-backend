import { AppDataSource } from '../../infrastructure/database';
import { Event } from '../models/Event';
import { IEventRepository } from '../../application/interfaces/IEventRepository';

export class EventImpl implements IEventRepository {
  private repository = AppDataSource.getRepository(Event);

  async findById(id: string): Promise<Event | null> {
    return this.repository.findOne({ where: { id }, relations: { coordinator: true } });
  }

  async findAll(filters?: { category?: string; status?: string; coordinatorId?: string }): Promise<Event[]> {
    const where: any = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;
    if (filters?.coordinatorId) where.coordinatorId = filters.coordinatorId;
    return this.repository.find({ where, relations: { coordinator: true }, order: { createdAt: 'DESC' } });
  }

  async save(event: Event): Promise<Event> {
    return this.repository.save(event);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
