import { IEventRepository } from '../../interfaces/IEventRepository';
import { IRegistrationRepository } from '../../interfaces/IRegistrationRepository';
import { IFeedbackRepository } from '../../interfaces/IFeedbackRepository';

export class GetReportSummaryUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private registrationRepository: IRegistrationRepository,
    private feedbackRepository: IFeedbackRepository
  ) {}

  async execute(coordinatorId?: string) {
    const events = await this.eventRepository.findAll(coordinatorId ? { coordinatorId } : undefined);
    const eventIds = events.map(e => e.id);
    
    // Basic aggregation for reports dashboard
    const registrations = await Promise.all(eventIds.map(id => this.registrationRepository.findAll({ eventId: id })));
    const feedbacks = await Promise.all(eventIds.map(id => this.feedbackRepository.findAll({ eventId: id })));
    
    let totalRegistrations = 0;
    let totalAttended = 0;
    
    const eventStats = events.map((event, index) => {
      const eventRegs = registrations[index];
      const eventFb = feedbacks[index];
      
      const regs = eventRegs.length;
      const attended = eventRegs.filter(r => r.attendance === 'Present').length;
      totalRegistrations += regs;
      totalAttended += attended;
      
      const rating = eventFb.length ? eventFb.reduce((sum, f) => sum + f.rating, 0) / eventFb.length : 0;
      
      return {
        id: event.id,
        title: event.title,
        category: event.category,
        registrations: regs,
        attended,
        rating: Number(rating.toFixed(1))
      };
    });

    const averageRating = feedbacks.flat().length 
      ? feedbacks.flat().reduce((sum, f) => sum + f.rating, 0) / feedbacks.flat().length 
      : 0;

    return {
      totalEvents: events.length,
      totalRegistrations,
      totalAttended,
      averageRating: Number(averageRating.toFixed(1)),
      eventStats
    };
  }
}
