import { AppDataSource } from '../../infrastructure/database';
import { EventRequest } from '../models/EventRequest';
import { IEventRequestRepository } from '../../application/interfaces/IEventRequestRepository';

export class EventRequestImpl implements IEventRequestRepository {
  private repository = AppDataSource.getRepository(EventRequest);

  async findById(id: string): Promise<EventRequest | null> {
    return this.repository.findOne({ where: { id }, relations: { user: true } });
  }

  async findAll(filters?: { userId?: string; status?: string }): Promise<EventRequest[]> {
    const where: any = {};
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.status) where.status = filters.status;
    return this.repository.find({ where, relations: { user: true }, order: { createdAt: 'DESC' } });
  }

  async save(request: EventRequest): Promise<EventRequest> {
    return this.repository.save(request);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
