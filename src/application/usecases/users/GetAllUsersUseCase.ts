import { IUserRepository } from '../../interfaces/IUserRepository';
import { AppError } from '../../../shared/error';
import { User, UserRole } from '../../../adapters/models/User';

export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(filters?: { role?: string; department?: string }) {
    return this.userRepository.findAll(filters);
  }
}

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department?: string;
    year?: string;
    roll?: string;
  }) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new AppError('Email is already in use', 409);
    const user = new User();
    Object.assign(user, { ...data, active: true });
    return this.userRepository.save(user);
  }
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(id: string, data: Partial<{
    name: string;
    email: string;
    department: string;
    year: string;
    roll: string;
    active: boolean;
    avatar: string;
  }>) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    if (data.email && data.email !== user.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing) throw new AppError('Email is already in use', 409);
    }
    Object.assign(user, data);
    return this.userRepository.save(user);
  }
}

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    await this.userRepository.delete(id);
  }
}

export class ChangePasswordUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    if (user.password !== currentPassword) throw new AppError('Current password is incorrect', 401);
    user.password = newPassword; // In production, hash with bcrypt
    return this.userRepository.save(user);
  }
}

export class ToggleUserActiveUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    user.active = !user.active;
    return this.userRepository.save(user);
  }
}
