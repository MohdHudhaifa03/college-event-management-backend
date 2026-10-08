import { IUserRepository } from '../../interfaces/IUserRepository';
import { AppError } from '../../../shared/error';
import { User, UserRole } from '../../../adapters/models/User';

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: {
    name: string;
    email: string;
    password: string;
    department?: string;
    year?: string;
    roll?: string;
  }): Promise<Omit<User, 'password'>> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('Email is already registered', 409);
    }

    const user = new User();
    user.name = data.name;
    user.email = data.email;
    user.password = data.password; // In production, hash with bcrypt
    user.role = UserRole.STUDENT;
    user.department = data.department;
    user.year = data.year;
    user.roll = data.roll;
    user.active = true;

    const saved = await this.userRepository.save(user);
    const { password: _, ...userWithoutPassword } = saved;
    return userWithoutPassword as Omit<User, 'password'>;
  }
}
