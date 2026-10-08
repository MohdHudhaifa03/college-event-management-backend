import { ICategoryRepository } from '../../interfaces/ICategoryRepository';
import { AppError } from '../../../shared/error';
import { Category } from '../../../adapters/models/Category';

export class GetAllCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute() { return this.categoryRepository.findAll(); }
}

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(data: { name: string; color: string; icon: string }) {
    const existing = await this.categoryRepository.findByName(data.name);
    if (existing) throw new AppError('Category already exists', 409);
    const category = new Category();
    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }
}

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(id: string, data: Partial<{ name: string; color: string; icon: string }>) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new AppError('Category not found', 404);
    if (data.name && data.name !== category.name) {
      const existing = await this.categoryRepository.findByName(data.name);
      if (existing) throw new AppError('Category name already exists', 409);
    }
    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }
}

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}
  async execute(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new AppError('Category not found', 404);
    await this.categoryRepository.delete(id);
  }
}
