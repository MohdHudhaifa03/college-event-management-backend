import { User } from '../../adapters/models/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(filters?: { role?: string; department?: string }): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
