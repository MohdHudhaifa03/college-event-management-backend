import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Event } from './Event';
import { EventRegistration } from './EventRegistration';
import { EventRequest } from './EventRequest';

export enum UserRole {
  ADMIN = 'admin',
  FACULTY = 'faculty',
  STUDENT = 'student'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT
  })
  role!: UserRole;

  @Column({ type: 'varchar', nullable: true })
  department?: string;

  @Column({ type: 'varchar', nullable: true })
  year?: string;

  @Column({ type: 'varchar', nullable: true })
  roll?: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @OneToMany(() => Event, (event: Event) => event.coordinator)
  coordinatedEvents!: Event[];

  @OneToMany(() => EventRegistration, (registration: EventRegistration) => registration.user)
  registrations!: EventRegistration[];

  @OneToMany(() => EventRequest, (request: EventRequest) => request.user)
  requests!: EventRequest[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
