import { IEventRepository } from '../../interfaces/IEventRepository';
import { AppError } from '../../../shared/error';
import { EventStatus } from '../../../adapters/models/Event';

export class UpdateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string, data: Partial<{
    title: string;
    description: string;
    category: string;
    date: string;
    time: string;
    venue: string;
    seats: number;
    image: string;
    status: EventStatus;
    remarks: string;
    notes: string;
    coordinatorId: string;
  }>) {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new AppError('Event not found', 404);
    Object.assign(event, data);
    return this.eventRepository.save(event);
  }
}
