import { IUserRepository } from '../../interfaces/IUserRepository';
import { AppError } from '../../../shared/error';
import jwt from 'jsonwebtoken';
import { config } from '../../../config/index';

export class GetMeUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string; role: string };
      const user = await this.userRepository.findById(decoded.id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Invalid or expired token', 401);
    }
  }
}
