import { AppDataSource } from '../../infrastructure/database';
import { EventRegistration } from '../models/EventRegistration';
import { IRegistrationRepository } from '../../application/interfaces/IRegistrationRepository';
import { In } from 'typeorm';

export class RegistrationImpl implements IRegistrationRepository {
  private repository = AppDataSource.getRepository(EventRegistration);

  async findById(id: string): Promise<EventRegistration | null> {
    return this.repository.findOne({ where: { id }, relations: { user: true, event: true } });
  }

  async findAll(filters?: { eventId?: string; studentId?: string; status?: string }): Promise<EventRegistration[]> {
    const where: any = {};
    if (filters?.eventId) where.eventId = filters.eventId;
    if (filters?.studentId) where.studentId = filters.studentId;
    if (filters?.status) where.status = filters.status;
    return this.repository.find({ where, relations: { user: true, event: true }, order: { registeredAt: 'DESC' } });
  }

  async findByEventAndStudent(eventId: string, studentId: string): Promise<EventRegistration | null> {
    return this.repository.findOne({
      where: { eventId, studentId, status: In(['Pending', 'Confirmed']) }
    });
  }

  async save(registration: EventRegistration): Promise<EventRegistration> {
    return this.repository.save(registration);
  }

  async saveMany(registrations: EventRegistration[]): Promise<EventRegistration[]> {
    return this.repository.save(registrations);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByEventId(eventId: string): Promise<void> {
    await this.repository.delete({ eventId });
  }

  async deleteByStudentId(studentId: string): Promise<void> {
    await this.repository.delete({ studentId });
  }
}
