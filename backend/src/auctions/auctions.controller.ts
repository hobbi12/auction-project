import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Get()
  findAll() {
    return this.auctionsService.findAll();
  }
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.auctionsService.findBySlug(slug);
  }
  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.auctionsService.findByCategory(category);
  }
  @UseGuards(JwtAuthGuard)

  @Post()
  createAuction(@Body() createAuctionDto: CreateAuctionDto, @CurrentUser() user:User) {
    return this.auctionsService.createAuction(createAuctionDto, user);
  }


  @Get('my-auctions')
  @UseGuards(JwtAuthGuard)

  async findUserAuctions(@CurrentUser() currentUser: User) {
    console.log('Current User in Controller:', currentUser); // Debug
    return this.auctionsService.findUserAuctions(currentUser);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(+id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionsService.update(+id, updateAuctionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: number, 
    @CurrentUser() currentUser: User
  ) {
    return this.auctionsService.remove(id, currentUser);
  }
}
