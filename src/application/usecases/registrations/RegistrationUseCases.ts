import { IRegistrationRepository } from '../../interfaces/IRegistrationRepository';
import { IEventRepository } from '../../interfaces/IEventRepository';
import { AppError } from '../../../shared/error';
import { EventRegistration, RegistrationStatus, AttendanceStatus } from '../../../adapters/models/EventRegistration';

export class CreateRegistrationUseCase {
  constructor(
    private registrationRepository: IRegistrationRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(eventId: string, studentId: string) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);
    if (event.status !== 'Upcoming') throw new AppError('Event is not open for registration', 400);

    const existing = await this.registrationRepository.findByEventAndStudent(eventId, studentId);
    if (existing) throw new AppError('You are already registered for this event', 409);

    const activeRegs = await this.registrationRepository.findAll({ eventId });
    const activeCount = activeRegs.filter(r => ['Pending', 'Confirmed'].includes(r.status)).length;
    if (activeCount >= event.seats) throw new AppError('Event is full', 400);

    const registration = new EventRegistration();
    registration.eventId = eventId;
    registration.studentId = studentId;
    registration.status = RegistrationStatus.PENDING;
    registration.attendance = AttendanceStatus.UNMARKED;
    registration.position = 'Participation';
    registration.certificate = false;

    return this.registrationRepository.save(registration);
  }
}

export class UpdateRegistrationStatusUseCase {
  constructor(private registrationRepository: IRegistrationRepository) {}

  async execute(id: string, status: RegistrationStatus) {
    const reg = await this.registrationRepository.findById(id);
    if (!reg) throw new AppError('Registration not found', 404);
    reg.status = status;
    return this.registrationRepository.save(reg);
  }
}

export class BulkUpdateRegistrationStatusUseCase {
  constructor(private registrationRepository: IRegistrationRepository) {}

  async execute(ids: string[], status: RegistrationStatus) {
    const results = [];
    for (const id of ids) {
      const reg = await this.registrationRepository.findById(id);
      if (reg) {
        reg.status = status;
        results.push(await this.registrationRepository.save(reg));
      }
    }
    return results;
  }
}

export class UpdateAttendanceUseCase {
  constructor(private registrationRepository: IRegistrationRepository) {}

  async execute(id: string, attendance: AttendanceStatus) {
    const reg = await this.registrationRepository.findById(id);
    if (!reg) throw new AppError('Registration not found', 404);
    reg.attendance = attendance;
    if (attendance !== 'Present') reg.certificate = false;
    return this.registrationRepository.save(reg);
  }
}

export class BulkUpdateAttendanceUseCase {
  constructor(private registrationRepository: IRegistrationRepository) {}

  async execute(updates: { id: string; attendance: AttendanceStatus }[]) {
    const results = [];
    for (const { id, attendance } of updates) {
      const reg = await this.registrationRepository.findById(id);
      if (reg) {
        reg.attendance = attendance;
        if (attendance !== 'Present') reg.certificate = false;
        results.push(await this.registrationRepository.save(reg));
      }
    }
    return results;
  }
}

export class GetRegistrationsUseCase {
  constructor(private registrationRepository: IRegistrationRepository) {}

  async execute(filters?: { eventId?: string; studentId?: string; status?: string }) {
    return this.registrationRepository.findAll(filters);
  }
}

export class UpdateResultsUseCase {
  constructor(
    private registrationRepository: IRegistrationRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(eventId: string, positions: { id: string; position: string }[], notes?: string) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);

    if (notes !== undefined) {
      event.notes = notes;
      await this.eventRepository.save(event);
    }

    for (const { id, position } of positions) {
      const reg = await this.registrationRepository.findById(id);
      if (reg && reg.eventId === eventId) {
        reg.position = position;
        await this.registrationRepository.save(reg);
      }
    }
  }
}

export class GenerateCertificatesUseCase {
  constructor(private registrationRepository: IRegistrationRepository) {}

  async execute(eventId: string) {
    const regs = await this.registrationRepository.findAll({ eventId });
    const attended = regs.filter(r => r.status === 'Confirmed' && r.attendance === 'Present');
    let count = 0;
    for (const reg of attended) {
      reg.certificate = true;
      await this.registrationRepository.save(reg);
      count++;
    }
    return { count };
  }
}

export class RevokeCertificateUseCase {
  constructor(private registrationRepository: IRegistrationRepository) {}

  async execute(id: string) {
    const reg = await this.registrationRepository.findById(id);
    if (!reg) throw new AppError('Registration not found', 404);
    reg.certificate = false;
    return this.registrationRepository.save(reg);
  }
}
