import { IEventRequestRepository } from '../../interfaces/IEventRequestRepository';
import { IEventRepository } from '../../interfaces/IEventRepository';
import { AppError } from '../../../shared/error';
import { EventRequest, RequestStatus } from '../../../adapters/models/EventRequest';
import { Event, EventStatus } from '../../../adapters/models/Event';

export class CreateEventRequestUseCase {
  constructor(private requestRepository: IEventRequestRepository) {}

  async execute(data: {
    userId: string;
    title: string;
    description: string;
    category?: string;
    proposedDate: string;
    proposedTime?: string;
    venue?: string;
    seats: number;
    image?: string;
  }) {
    const request = new EventRequest();
    Object.assign(request, { ...data, status: RequestStatus.PENDING });
    return this.requestRepository.save(request);
  }
}

export class GetEventRequestsUseCase {
  constructor(private requestRepository: IEventRequestRepository) {}

  async execute(filters?: { userId?: string; status?: string }) {
    return this.requestRepository.findAll(filters);
  }
}

export class ApproveEventRequestUseCase {
  constructor(
    private requestRepository: IEventRequestRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(id: string) {
    const request = await this.requestRepository.findById(id);
    if (!request) throw new AppError('Event request not found', 404);
    if (request.status !== RequestStatus.PENDING) throw new AppError('Request has already been processed', 400);

    request.status = RequestStatus.APPROVED;
    request.remarks = 'Approved by the administrator';
    await this.requestRepository.save(request);

    // Create the event from the request
    const event = new Event();
    event.title = request.title;
    event.description = request.description;
    event.category = request.category;
    event.date = request.proposedDate;
    event.time = request.proposedTime;
    event.venue = request.venue || '';
    event.seats = request.seats;
    event.image = request.image;
    event.coordinatorId = request.userId;
    event.status = EventStatus.UPCOMING;
    event.remarks = 'Approved by the administrator';

    const savedEvent = await this.eventRepository.save(event);
    return { request, event: savedEvent };
  }
}

export class RejectEventRequestUseCase {
  constructor(private requestRepository: IEventRequestRepository) {}

  async execute(id: string, reason: string) {
    const request = await this.requestRepository.findById(id);
    if (!request) throw new AppError('Event request not found', 404);
    if (request.status !== RequestStatus.PENDING) throw new AppError('Request has already been processed', 400);

    request.status = RequestStatus.REJECTED;
    request.remarks = reason;
    return this.requestRepository.save(request);
  }
}
