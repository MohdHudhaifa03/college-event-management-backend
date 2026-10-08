import { IEventRepository } from '../../interfaces/IEventRepository';

export class GetAllEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(filters?: { category?: string; status?: string; coordinatorId?: string }) {
    return this.eventRepository.findAll(filters);
  }
}
