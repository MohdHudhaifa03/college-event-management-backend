import { Feedback } from '../../adapters/models/Feedback';

export interface IFeedbackRepository {
  findById(id: string): Promise<Feedback | null>;
  findAll(filters?: { eventId?: string; studentId?: string }): Promise<Feedback[]>;
  findByEventAndStudent(eventId: string, studentId: string): Promise<Feedback | null>;
  save(feedback: Feedback): Promise<Feedback>;
  delete(id: string): Promise<void>;
  deleteByEventId(eventId: string): Promise<void>;
}
