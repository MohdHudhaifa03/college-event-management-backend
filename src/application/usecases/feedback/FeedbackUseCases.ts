import { IFeedbackRepository } from '../../interfaces/IFeedbackRepository';
import { IRegistrationRepository } from '../../interfaces/IRegistrationRepository';
import { AppError } from '../../../shared/error';
import { Feedback } from '../../../adapters/models/Feedback';

export class CreateFeedbackUseCase {
  constructor(
    private feedbackRepository: IFeedbackRepository,
    private registrationRepository: IRegistrationRepository
  ) {}

  async execute(data: { studentId: string; eventId: string; rating: number; comment: string; tags: string[] }) {
    // Check the student actually attended this event
    const regs = await this.registrationRepository.findAll({ eventId: data.eventId, studentId: data.studentId });
    const attended = regs.find(r => r.status === 'Confirmed' && r.attendance === 'Present');
    if (!attended) throw new AppError('You must attend an event before giving feedback', 403);

    const existing = await this.feedbackRepository.findByEventAndStudent(data.eventId, data.studentId);
    if (existing) throw new AppError('You have already submitted feedback for this event', 409);

    if (data.rating < 1 || data.rating > 5) throw new AppError('Rating must be between 1 and 5', 400);

    const feedback = new Feedback();
    Object.assign(feedback, data);
    return this.feedbackRepository.save(feedback);
  }
}

export class GetFeedbackUseCase {
  constructor(private feedbackRepository: IFeedbackRepository) {}

  async execute(filters?: { eventId?: string; studentId?: string }) {
    return this.feedbackRepository.findAll(filters);
  }
}
