import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Event } from './Event';

export enum RegistrationStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled'
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  UNMARKED = 'Unmarked'
}

@Entity('event_registrations')
export class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, user => user.registrations)
  @JoinColumn({ name: 'studentId' })
  user!: User;

  @Column({ type: 'uuid' })
  studentId!: string;

  @ManyToOne(() => Event, event => event.registrations)
  @JoinColumn({ name: 'eventId' })
  event!: Event;

  @Column({ type: 'uuid' })
  eventId!: string;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING
  })
  status!: RegistrationStatus;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.UNMARKED
  })
  attendance!: AttendanceStatus;

  @Column({ type: 'varchar', default: 'Participation' })
  position!: string;

  @Column({ type: 'boolean', default: false })
  certificate!: boolean;

  @CreateDateColumn()
  registeredAt!: Date;
}
