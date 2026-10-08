import { EventRegistration } from '../../adapters/models/EventRegistration';

export interface IRegistrationRepository {
  findById(id: string): Promise<EventRegistration | null>;
  findAll(filters?: { eventId?: string; studentId?: string; status?: string }): Promise<EventRegistration[]>;
  findByEventAndStudent(eventId: string, studentId: string): Promise<EventRegistration | null>;
  save(registration: EventRegistration): Promise<EventRegistration>;
  saveMany(registrations: EventRegistration[]): Promise<EventRegistration[]>;
  delete(id: string): Promise<void>;
  deleteByEventId(eventId: string): Promise<void>;
  deleteByStudentId(studentId: string): Promise<void>;
}
