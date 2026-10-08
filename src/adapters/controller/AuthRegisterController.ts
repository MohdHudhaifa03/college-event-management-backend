import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../../application/usecases/auth/RegisterUseCase';
import { UserImpl } from '../repositories/UserImpl';
import jwt from 'jsonwebtoken';
import { config } from '../../config/index';

export class AuthRegisterController {
  private registerUseCase: RegisterUseCase;

  constructor() {
    const userRepository = new UserImpl();
    this.registerUseCase = new RegisterUseCase(userRepository);
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.registerUseCase.execute(req.body);

      // Log them in immediately
      const token = jwt.sign(
        { id: result.id, role: result.role },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({
        success: true,
        data: { token, user: result }
      });
    } catch (error) {
      next(error);
    }
  };
}
