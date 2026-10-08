import { EventRequest } from '../../adapters/models/EventRequest';

export interface IEventRequestRepository {
  findById(id: string): Promise<EventRequest | null>;
  findAll(filters?: { userId?: string; status?: string }): Promise<EventRequest[]>;
  save(request: EventRequest): Promise<EventRequest>;
  delete(id: string): Promise<void>;
}
