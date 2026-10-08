import { Request, Response, NextFunction } from 'express';
import { GetAllUsersUseCase } from '../../application/usecases/users/GetAllUsersUseCase';
import { UserImpl } from '../repositories/UserImpl';

export class UserController {
  private getAllUsersUseCase: GetAllUsersUseCase;

  constructor() {
    const userRepository = new UserImpl();
    this.getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.getAllUsersUseCase.execute();
      
      // Remove passwords before sending response
      const sanitizedUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.status(200).json({
        success: true,
        data: sanitizedUsers
      });
    } catch (error) {
      next(error);
    }
  };
}
