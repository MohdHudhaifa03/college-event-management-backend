import { AppDataSource, initializeDatabase } from '../infrastructure/database';
import { User, UserRole } from '../adapters/models/User';
import { Event, EventStatus } from '../adapters/models/Event';
import { Category } from '../adapters/models/Category';
import { CollegeSettings } from '../adapters/models/CollegeSettings';
import { EventRegistration, RegistrationStatus, AttendanceStatus } from '../adapters/models/EventRegistration';
import { EventRequest, RequestStatus } from '../adapters/models/EventRequest';
import { Feedback } from '../adapters/models/Feedback';
import { Notification } from '../adapters/models/Notification';

async function seed() {
  await initializeDatabase();
  console.log('Seeding data...');

  const userRepository = AppDataSource.getRepository(User);
  const eventRepository = AppDataSource.getRepository(Event);
  const categoryRepository = AppDataSource.getRepository(Category);
  const settingsRepository = AppDataSource.getRepository(CollegeSettings);
  const registrationRepository = AppDataSource.getRepository(EventRegistration);
  const requestRepository = AppDataSource.getRepository(EventRequest);
  const feedbackRepository = AppDataSource.getRepository(Feedback);
  const notificationRepository = AppDataSource.getRepository(Notification);

  // Clear existing data
  await feedbackRepository.query('TRUNCATE TABLE "feedback" CASCADE;');
  await requestRepository.query('TRUNCATE TABLE "event_requests" CASCADE;');
  await notificationRepository.query('TRUNCATE TABLE "notifications" CASCADE;');
  await registrationRepository.query('TRUNCATE TABLE "event_registrations" CASCADE;');
  await eventRepository.query('TRUNCATE TABLE "events" CASCADE;');
  await userRepository.query('TRUNCATE TABLE "users" CASCADE;');
  await categoryRepository.query('TRUNCATE TABLE "categories" CASCADE;');
  await settingsRepository.query('TRUNCATE TABLE "college_settings" CASCADE;');

  const hashedPassword = 'password123'; // Simplified

  // Seed settings
  await settingsRepository.save({ name: 'Westbridge College', year: '2026 - 2027' });

  // Seed categories
  const catNames = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Literary', 'Social'];
  const colors = ['violet', 'pink', 'green', 'cyan', 'amber', 'violet', 'pink', 'green'];
  const icons = ['Code', 'Music', 'Trophy', 'Palette', 'Mic', 'Zap', 'Book', 'Leaf'];
  
  await categoryRepository.save(catNames.map((name, i) => ({
    name, color: colors[i], icon: icons[i]
  })));

  // Create Users
  const admin = userRepository.create({
    name: 'Admin User', email: 'admin@college.com', password: hashedPassword, role: UserRole.ADMIN, active: true
  });

  const faculties = [
    userRepository.create({ name: 'Jane Faculty', email: 'faculty@college.com', password: hashedPassword, role: UserRole.FACULTY, department: 'Computer Science', roll: 'FAC001', active: true }),
    userRepository.create({ name: 'Robert Smith', email: 'robert.smith@college.com', password: hashedPassword, role: UserRole.FACULTY, department: 'Information Technology', roll: 'FAC002', active: true }),
    userRepository.create({ name: 'Emily Clark', email: 'emily.c@college.com', password: hashedPassword, role: UserRole.FACULTY, department: 'Electronics', roll: 'FAC003', active: true })
  ];

  const students = Array.from({ length: 10 }).map((_, i) => 
    userRepository.create({
      name: `Student ${i+1}`, 
      email: `student${i+1}@college.com`, 
      password: hashedPassword, 
      role: UserRole.STUDENT, 
      department: i % 2 === 0 ? 'Computer Science' : 'Information Technology', 
      year: `${(i % 4) + 1}`, 
      roll: `CS20260${10 + i}`, 
      active: true
    })
  );
  // Guarantee one specific student email for testing
  students[0].email = 'student@college.com';
  students[0].name = 'John Student';

  await userRepository.save([admin, ...faculties, ...students]);
  console.log('Users seeded');

  // Create Events
  const events = [
    // Upcoming Events
    eventRepository.create({
      title: 'Tech Symposium 2026', description: 'Annual technology symposium for all engineering students.',
      date: '2026-11-15', time: '09:00', venue: 'Main Auditorium', seats: 200, category: 'Technical',
      status: EventStatus.UPCOMING, coordinator: faculties[0]
    }),
    eventRepository.create({
      title: 'Career Fair', description: 'Meet top recruiters from tech companies.',
      date: '2026-12-01', time: '10:00', venue: 'Campus Sports Hall', seats: 500, category: 'Social',
      status: EventStatus.UPCOMING, coordinator: admin
    }),
    eventRepository.create({
      title: 'AI Workshop', description: 'Hands-on workshop on LLMs.',
      date: '2026-10-20', time: '14:00', venue: 'Lab 4', seats: 30, category: 'Workshop',
      status: EventStatus.UPCOMING, coordinator: faculties[1]
    }),
    // Past Events
    eventRepository.create({
      title: 'Spring Fest 2026', description: 'Annual cultural festival.',
      date: '2026-03-10', time: '18:00', venue: 'Open Air Theatre', seats: 1000, category: 'Cultural',
      status: EventStatus.COMPLETED, coordinator: faculties[2]
    }),
    eventRepository.create({
      title: 'Inter-College Basketball', description: 'Finals of the basketball tournament.',
      date: '2026-04-15', time: '16:00', venue: 'Basketball Court', seats: 150, category: 'Sports',
      status: EventStatus.COMPLETED, coordinator: faculties[0]
    })
  ];

  await eventRepository.save(events);
  console.log('Events seeded');

  // Create Registrations for Upcoming Events
  const registrations = [];
  for (let i = 0; i < 5; i++) {
    registrations.push(registrationRepository.create({
      event: events[0], user: students[i], status: RegistrationStatus.CONFIRMED, attendance: AttendanceStatus.UNMARKED, position: 'Participant'
    }));
  }
  registrations.push(registrationRepository.create({
    event: events[0], user: students[5], status: RegistrationStatus.PENDING, attendance: AttendanceStatus.UNMARKED, position: 'Participant'
  }));
  
  // Create Registrations & Attendance for Past Events
  for (let i = 0; i < 8; i++) {
    const isPresent = i % 3 !== 0; // some absent
    registrations.push(registrationRepository.create({
      event: events[3], user: students[i], status: RegistrationStatus.CONFIRMED, 
      attendance: isPresent ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT, 
      position: 'Participant', certificate: isPresent
    }));
  }

  await registrationRepository.save(registrations);
  console.log('Registrations seeded');

  // Event Requests
  const requests = [
    requestRepository.create({
      user: faculties[1], title: 'Cybersecurity Seminar', description: 'Guest lecture by industry expert.', category: 'Seminar', proposedDate: '2026-11-20', proposedTime: '11:00', venue: 'Seminar Hall A', seats: 100, status: RequestStatus.PENDING
    }),
    requestRepository.create({
      user: students[0], title: 'Student Hackathon', description: '36-hour coding marathon.', category: 'Hackathon', proposedDate: '2026-12-10', proposedTime: '08:00', venue: 'Main Library', seats: 200, status: RequestStatus.APPROVED
    })
  ];
  await requestRepository.save(requests);
  console.log('Event Requests seeded');

  // Feedback
  const feedbacks = [
    feedbackRepository.create({
      student: students[0], event: events[3], rating: 5, comment: 'Amazing festival, loved it!', tags: ['fun', 'well-organized']
    }),
    feedbackRepository.create({
      student: students[1], event: events[3], rating: 4, comment: 'Good music, but food could be better.', tags: ['crowded']
    })
  ];
  await feedbackRepository.save(feedbacks);
  console.log('Feedback seeded');

  // Notifications
  const notifications = [
    notificationRepository.create({ role: UserRole.STUDENT, text: 'Tech Symposium 2026 registrations are open!', read: false }),
    notificationRepository.create({ role: UserRole.FACULTY, text: 'Please review pending event requests.', read: false })
  ];
  await notificationRepository.save(notifications);
  console.log('Notifications seeded');

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error seeding data:', err);
  process.exit(1);
});
