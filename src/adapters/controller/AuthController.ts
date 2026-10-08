import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../application/usecases/auth/LoginUseCase';
import { GetMeUseCase } from '../../application/usecases/auth/GetMeUseCase';
import { UserImpl } from '../repositories/UserImpl';

export class AuthController {
  private loginUseCase: LoginUseCase;
  private getMeUseCase: GetMeUseCase;

  constructor() {
    const userRepository = new UserImpl();
    this.loginUseCase = new LoginUseCase(userRepository);
    this.getMeUseCase = new GetMeUseCase(userRepository);
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute(email, password);

      // Set JWT as an httpOnly cookie (secure, not accessible via JS)
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({
        success: true,
        data: {
          token: result.token, // Also send token in response body for frontend storage
          user: result.user
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Read token from cookie first, then fallback to Authorization header
      const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const user = await this.getMeUseCase.execute(token);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear the cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
