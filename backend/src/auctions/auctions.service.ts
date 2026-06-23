import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private auctionsRepository: Repository<Auction>,
    private productsService:ProductsService
  ){}
  // create(createAuctionDto: CreateAuctionDto) {
  //   return 'This action adds a new auction';
  // }
async createAuction(createAuctionDto: CreateAuctionDto, currentUser: User) {
  // 1. جلب المنتج مع مالكه
  const product = await this.productsService.findProductById(createAuctionDto.productId);
  
  if (!product) {
    throw new NotFoundException('Product not found or ID is invalid');
  }
  console.log("Product owner:", currentUser); // Debug
  // 2. التحقق من وجود المالك أولاً لتجنب الـ TypeError
  if (!product.owner || product.owner.id !== currentUser.id) {
    throw new ForbiddenException("You can only create auction for your own products");
  }

  // 3. إنشاء وحفظ المزاد بأمان
  const auction = this.auctionsRepository.create({
    product: product,
    seller: currentUser,
    startingPrice: product.startingPrice,
    currentPrice: product.startingPrice,
    startsAt: createAuctionDto.startsAt,
    endsAt: createAuctionDto.endsAt,
    status: 'active',
  });

  return await this.auctionsRepository.save(auction);
}
  async findBySlug(slug: string) {
  const auction = await this.auctionsRepository.findOne({
    where: { product: { slug } },
    relations: ['product', 'product.owner', 'seller']
  });

  if (!auction) {
    throw new NotFoundException('Auction not found');
  }

  return auction;
}
  findAll() {
    return this.auctionsRepository.find({relations:{product:true},order:{createdAt:'DESC'}}); ; 
  }

  findOne(id: number) {
    return this.auctionsRepository.findOne({where:{id},relations:{product:true,seller:true}});
  }
async findByCategory(category: string) {
  return this.auctionsRepository.find({
    where: {
      product: {
        category: category.trim()   // تنظيف الإدخال
      }
    },
    relations: ['product', 'product.owner', 'seller'],  // جلب بيانات إضافية
    order: { 
      createdAt: 'DESC' 
    }
  });
}

  async findUserAuctions(currentUser: User) {
  if (!currentUser?.id) {
    throw new Error('User ID is required');
  }

  return this.auctionsRepository.find({
    where: {
      seller: {id:currentUser.id}
    },
    relations: ['product', 'product.owner', 'seller'],
    select: {
      id: true,
      startingPrice: true,
      currentPrice: true,
      startsAt: true,
      endsAt: true,
      status: true,
      createdAt: true,
      product: {
        id: true,
        title: true,
        imageUrl: true,
        category: true,
        slug: true
      }
    },
    order: { 
      createdAt: 'DESC' 
    }
  });
}
  update(id: number, updateAuctionDto: UpdateAuctionDto) {
    return `This action updates a #${id} auction`;
  }

  async remove(id: number, currentUser: User) {
    // 1. جلب المزاد مع الـ seller
    const auction = await this.auctionsRepository.findOne({
      where: { id },
      relations: ['seller']
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    // 2. التأكد إن المزاد يخص اليوزر الحالي
    if (auction.seller.id !== currentUser.id) {
      throw new ForbiddenException("You can only delete your own auctions");
    }

    // 3. حذف المزاد
    await this.auctionsRepository.delete(id);

    return { 
      message: 'Auction deleted successfully',
      auctionId: id 
    };
  }
}
