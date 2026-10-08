"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../infrastructure/database");
const User_1 = require("../adapters/models/User");
const Event_1 = require("../adapters/models/Event");
// import bcrypt from 'bcrypt'; // In a real scenario
async function seed() {
    await (0, database_1.initializeDatabase)();
    console.log('Seeding data...');
    const userRepository = database_1.AppDataSource.getRepository(User_1.User);
    const eventRepository = database_1.AppDataSource.getRepository(Event_1.Event);
    // Clear existing data
    await eventRepository.delete({});
    await userRepository.delete({});
    // const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedPassword = 'password123'; // Simplified
    // Create Users
    const admin = userRepository.create({
        name: 'Admin User',
        email: 'admin@college.edu',
        password: hashedPassword,
        role: User_1.UserRole.ADMIN,
        department: 'IT'
    });
    const organizer = userRepository.create({
        name: 'Jane Organizer',
        email: 'jane@college.edu',
        password: hashedPassword,
        role: User_1.UserRole.ORGANIZER,
        department: 'Computer Science'
    });
    const student = userRepository.create({
        name: 'John Student',
        email: 'john@college.edu',
        password: hashedPassword,
        role: User_1.UserRole.STUDENT,
        department: 'Engineering'
    });
    await userRepository.save([admin, organizer, student]);
    console.log('Users seeded');
    // Create Events
    const event1 = eventRepository.create({
        title: 'Tech Symposium 2026',
        description: 'Annual technology symposium for all engineering students.',
        date: new Date('2026-11-15T09:00:00Z'),
        location: 'Main Auditorium',
        capacity: 200,
        category: 'Technology',
        organizer: organizer
    });
    const event2 = eventRepository.create({
        title: 'Career Fair',
        description: 'Meet top recruiters from tech companies.',
        date: new Date('2026-12-01T10:00:00Z'),
        location: 'Campus Sports Hall',
        capacity: 500,
        category: 'Career',
        organizer: admin
    });
    await eventRepository.save([event1, event2]);
    console.log('Events seeded');
    console.log('Seeding complete!');
    process.exit(0);
}
seed().catch(err => {
    console.error('Error seeding data:', err);
    process.exit(1);
});
