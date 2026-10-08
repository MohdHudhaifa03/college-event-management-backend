import { Event } from '../../adapters/models/Event';

export interface IEventRepository {
  findById(id: string): Promise<Event | null>;
  findAll(filters?: { category?: string; status?: string; coordinatorId?: string }): Promise<Event[]>;
  save(event: Event): Promise<Event>;
  delete(id: string): Promise<void>;
}
