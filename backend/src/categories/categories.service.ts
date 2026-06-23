import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
// import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    // @InjectRepository(Product)
    // private productsRepository: Repository<Product>
  ){}
// src/categories/categories.service.ts
async create(createCategoryDto: CreateCategoryDto) {
  // تنظيف الاسم (Case Insensitive + Trim)
  const normalizedName = createCategoryDto.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');   // إزالة المسافات الزائدة

  // التحقق إذا كان التصنيف موجود مسبقاً (Case Insensitive)
  const existCategory = await this.categoryRepository.findOne({
    where: { 
      name: normalizedName 
    }
  });

  if (existCategory) {
    throw new ForbiddenException(`Category "${existCategory.name}" already exists`);
  }

  // إنشاء التصنيف الجديد
  const newCategory = this.categoryRepository.create({
    name: normalizedName,           // نحفظه lowercase
    description: createCategoryDto.description?.trim(),
    imageUrl: createCategoryDto.imageUrl,
  });

  const savedCategory = await this.categoryRepository.save(newCategory);

  return {
    message: 'Category created successfully',
    category: savedCategory
  };
}

  async findAll() {
    const res=await this.categoryRepository.find();
    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
