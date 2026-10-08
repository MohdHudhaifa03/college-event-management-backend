import { AppDataSource } from '../../infrastructure/database';
import { User } from '../models/User';
import { IUserRepository } from '../../application/interfaces/IUserRepository';

export class UserImpl implements IUserRepository {
  private repository = AppDataSource.getRepository(User);

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findAll(filters?: { role?: string; department?: string }): Promise<User[]> {
    const where: any = {};
    if (filters?.role) where.role = filters.role;
    if (filters?.department) where.department = filters.department;
    return this.repository.find({ where, order: { createdAt: 'DESC' } });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
