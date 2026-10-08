import { Request, Response, NextFunction } from 'express';
import {
  GetAllCategoriesUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase
} from '../../application/usecases/categories/CategoryUseCases';
import { CategoryImpl } from '../repositories/CategoryImpl';

export class CategoryController {
  private getAllCategories: GetAllCategoriesUseCase;
  private createCategory: CreateCategoryUseCase;
  private updateCategory: UpdateCategoryUseCase;
  private deleteCategory: DeleteCategoryUseCase;

  constructor() {
    const repo = new CategoryImpl();
    this.getAllCategories = new GetAllCategoriesUseCase(repo);
    this.createCategory = new CreateCategoryUseCase(repo);
    this.updateCategory = new UpdateCategoryUseCase(repo);
    this.deleteCategory = new DeleteCategoryUseCase(repo);
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getAllCategories.execute();
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.createCategory.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.updateCategory.execute(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.deleteCategory.execute(req.params.id as string);
      res.status(200).json({ success: true, message: 'Deleted' });
    } catch (e) { next(e); }
  };
}
