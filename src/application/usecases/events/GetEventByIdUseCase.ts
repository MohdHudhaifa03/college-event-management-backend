import { IEventRepository } from '../../interfaces/IEventRepository';
import { AppError } from '../../../shared/error';

export class GetEventByIdUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string) {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new AppError('Event not found', 404);
    return event;
  }
}
