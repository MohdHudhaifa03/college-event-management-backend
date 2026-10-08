import { IUserRepository } from '../../interfaces/IUserRepository';
import { AppError } from '../../../shared/error';
import jwt from 'jsonwebtoken';
import { config } from '../../../config/index';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<{ token: string; user: any }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.active) {
      throw new AppError('you dont have accsess or inactive account please contact admin..', 403);
    }

    // For now, simple password comparison. In production, use bcrypt.
    const isMatch = password === user.password;

    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Sign a real JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword
    };
  }
}
