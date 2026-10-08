import { IEventRepository } from '../../interfaces/IEventRepository';
import { Event, EventStatus } from '../../../adapters/models/Event';

export class CreateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(data: {
    title: string;
    description: string;
    category?: string;
    date: string;
    time?: string;
    venue: string;
    seats: number;
    image?: string;
    coordinatorId: string;
    status?: EventStatus;
  }) {
    const event = new Event();
    Object.assign(event, {
      ...data,
      status: data.status || EventStatus.PENDING
    });
    return this.eventRepository.save(event);
  }
}
