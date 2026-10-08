import { IEventRepository } from '../../interfaces/IEventRepository';
import { IRegistrationRepository } from '../../interfaces/IRegistrationRepository';
import { IFeedbackRepository } from '../../interfaces/IFeedbackRepository';
import { AppError } from '../../../shared/error';

export class DeleteEventUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private registrationRepository: IRegistrationRepository,
    private feedbackRepository: IFeedbackRepository
  ) {}

  async execute(id: string) {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new AppError('Event not found', 404);

    // Cascade delete registrations and feedback
    await this.registrationRepository.deleteByEventId(id);
    await this.feedbackRepository.deleteByEventId(id);
    await this.eventRepository.delete(id);
  }
}
