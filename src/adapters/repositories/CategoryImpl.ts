import { AppDataSource } from '../../infrastructure/database';
import { Category } from '../models/Category';
import { ICategoryRepository } from '../../application/interfaces/ICategoryRepository';

export class CategoryImpl implements ICategoryRepository {
  private repository = AppDataSource.getRepository(Category);

  async findById(id: string): Promise<Category | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Category | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findAll(): Promise<Category[]> {
    return this.repository.find({ order: { name: 'ASC' } });
  }

  async save(category: Category): Promise<Category> {
    return this.repository.save(category);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
