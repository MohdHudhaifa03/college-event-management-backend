import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { EventRegistration } from './EventRegistration';

export enum EventStatus {
  UPCOMING = 'Upcoming',
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  REJECTED = 'Rejected'
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', nullable: true })
  category?: string;

  @Column({ type: 'varchar' })
  date!: string;

  @Column({ type: 'varchar', nullable: true })
  time?: string;

  @Column({ type: 'varchar' })
  venue!: string;

  @Column({ type: 'int', default: 120 })
  seats!: number;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PENDING
  })
  status!: EventStatus;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => User, user => user.coordinatedEvents)
  @JoinColumn({ name: 'coordinatorId' })
  coordinator!: User;

  @Column({ type: 'uuid', nullable: true })
  coordinatorId?: string;

  @OneToMany(() => EventRegistration, (registration: EventRegistration) => registration.event)
  registrations!: EventRegistration[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
