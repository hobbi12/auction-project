import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @UseGuards(JwtAuthGuard)

// @Get('generate-slugs')
//   async generateSlugsForExistingProducts() {
//     return this.productsService.generateSlugsForExistingProducts();
//   }
  @Get()
  findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @Get('categories')
  async getAllUniqueCategories() {
    return this.productsService.getAllUniqueCategories();
  }
    @Get(':category')
  findByCategory(@Param('category') category: string) {
    return this.productsService.findByCategory(category);
  }
  @UseGuards(JwtAuthGuard)
    @Post()
  createNewProduct(@Body() createProductDto: CreateProductDto, @CurrentUser() user: User) {
    return this.productsService.createNewProduct(createProductDto,user);
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }
}
