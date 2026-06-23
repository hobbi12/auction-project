import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IsNull } from 'typeorm';   // ← أضف هذا في الأعلى
@Injectable()
export class ProductsService {
  create: any;
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>
  ) {}
private generateSlug(title: string, existingSlugs: string[] = []): string {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  let finalSlug = slug;
  let counter = 1;

  // إذا الـ slug موجود، نضيف رقم في النهاية
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  return finalSlug;
}
async createNewProduct(createProductDto: CreateProductDto, user: User) {
  // جلب كل الـ slugs الموجودة
  const existingProducts = await this.productsRepository.find({ select: ['slug'] });
  const existingSlugs = existingProducts.map(p => p.slug).filter(Boolean) as string[];

  const newProduct = this.productsRepository.create({
    ...createProductDto,
    slug: this.generateSlug(createProductDto.title, existingSlugs),
    owner: user,
  });

  return this.productsRepository.save(newProduct);
}

  findAllProducts() {
    return this.productsRepository.find({relations:{owner:true}});
  }

// async generateSlugsForExistingProducts() {
//   // جلب كل المنتجات اللي slug null
//   const products = await this.productsRepository.find({
//     where: { slug: IsNull() },
//     select: ['id', 'title', 'slug']
//   });

//   console.log(`🔍 Found ${products.length} products with null slug`);

//   if (products.length === 0) {
//     return { message: "No products need slug update." };
//   }

//   let updated = 0;

//   for (const product of products) {
//     const newSlug = this.generateSlug(product.title);
    
//     // تحديث المنتج
//     await this.productsRepository.update(product.id, { slug: newSlug });
    
//     console.log(`✅ Updated: ${product.title} → ${newSlug}`);
//     updated++;
//   }

//   return {
//     message: `✅ Successfully updated ${updated} products with slugs`,
//     updatedCount: updated
//   };
// }


  findProductById(id: number) {
    return this.productsRepository.findOne({where:{id},relations:{owner:true}});
  }
    findByCategory(category: string) {
    return this.productsRepository.find({where:{category},relations:{owner:true}});
  }
  async getAllUniqueCategories() {
    const categories = await this.productsRepository.createQueryBuilder("product")
    .select("product.category", "category")
    .addSelect('COUNT(product.id)', 'count')
    .where("product.category IS NOT NULL")
    .groupBy('product.category')
    .orderBy('product.category', 'DESC')
    .getRawMany()
    return categories.map(c => c.category);
  }
  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
