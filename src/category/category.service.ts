import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) { }

  async create(category: Category): Promise<Category> {
    return await this.categoryRepository.save(category);
  }

  async findOneById(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { id } });
  }
}
