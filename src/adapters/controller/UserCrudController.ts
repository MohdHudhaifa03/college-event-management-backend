import { Request, Response, NextFunction } from 'express';
import {
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  ChangePasswordUseCase,
  ToggleUserActiveUseCase
} from '../../application/usecases/users/GetAllUsersUseCase';
import { UserImpl } from '../repositories/UserImpl';

export class UserCrudController {
  private getAllUsers: GetAllUsersUseCase;
  private getUserById: GetUserByIdUseCase;
  private createUser: CreateUserUseCase;
  private updateUser: UpdateUserUseCase;
  private deleteUser: DeleteUserUseCase;
  private changePass: ChangePasswordUseCase;
  private toggleActive: ToggleUserActiveUseCase;

  constructor() {
    const repo = new UserImpl();
    this.getAllUsers = new GetAllUsersUseCase(repo);
    this.getUserById = new GetUserByIdUseCase(repo);
    this.createUser = new CreateUserUseCase(repo);
    this.updateUser = new UpdateUserUseCase(repo);
    this.deleteUser = new DeleteUserUseCase(repo);
    this.changePass = new ChangePasswordUseCase(repo);
    this.toggleActive = new ToggleUserActiveUseCase(repo);
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getAllUsers.execute(req.query);
      const sanitized = result.map(u => { const { password, ...rest } = u; return rest; });
      res.status(200).json({ success: true, data: sanitized });
    } catch (e) { next(e); }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getUserById.execute(req.params.id as string);
      const { password, ...rest } = result;
      res.status(200).json({ success: true, data: rest });
    } catch (e) { next(e); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.createUser.execute(req.body);
      const { password, ...rest } = result;
      res.status(201).json({ success: true, data: rest });
    } catch (e) { next(e); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.updateUser.execute(req.params.id as string, req.body);
      const { password, ...rest } = result;
      res.status(200).json({ success: true, data: rest });
    } catch (e) { next(e); }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.deleteUser.execute(req.params.id as string);
      res.status(200).json({ success: true, message: 'Deleted' });
    } catch (e) { next(e); }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In real app, only self or admin can do this
      const userId = (req.user?.id || req.params.id) as string;
      await this.changePass.execute(userId, req.body.currentPassword, req.body.newPassword);
      res.status(200).json({ success: true, message: 'Password changed' });
    } catch (e) { next(e); }
  };

  toggleActiveState = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.toggleActive.execute(req.params.id as string);
      res.status(200).json({ success: true, data: result.active });
    } catch (e) { next(e); }
  };
}
