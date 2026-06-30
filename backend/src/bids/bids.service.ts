import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Repository } from 'typeorm';
import { Auction } from 'src/auctions/entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidsRepository:Repository<Bid>,
    @InjectRepository(Auction)
    private auctionsRepository:Repository<Auction>
  ) {}
  async createBid(createBidDto: CreateBidDto,currentUser:User) {
    const existAuction=await this.auctionsRepository.findOne({where:{id:createBidDto.auctionId},relations:{seller:true}});
    if(!existAuction){
      throw new ForbiddenException("Auction not found");
    }
    if(existAuction.seller.id===currentUser.id){
      throw new ForbiddenException("You cannot bid on your own auction");
    }
    if(createBidDto.amount<=existAuction.currentPrice){
      throw new ForbiddenException("Bid amount must be higher than current price");
    }
    const newBid=this.bidsRepository.create({
    auction:existAuction,
    bidder: currentUser,
    amount: createBidDto.amount,
    });
    const savedBid = await this.bidsRepository.save(newBid); 
    existAuction.currentPrice=createBidDto.amount;
    await this.auctionsRepository.save(existAuction);
    return savedBid;
   }


async findMyBids(currentUser: User) {
  const myBids = await this.bidsRepository.find({
    where: { 
      bidder: { id: currentUser.id } 
    },
    relations: ['auction', 'auction.product'],
    order: { 
      createdAt: 'DESC' 
    }
  });

  // فلترة + أخذ آخر مزايدة لكل auction
  const latestBidsMap = new Map<number, any>();

  myBids.forEach(bid => {
    // حماية من undefined
    if (!bid.auction || !bid.auction.product) return;

    const auctionId = bid.auction.id;

    // أخذ أحدث مزايدة (بسبب الترتيب DESC)
    if (!latestBidsMap.has(auctionId)) {
      latestBidsMap.set(auctionId, bid);
    }
  });

  return Array.from(latestBidsMap.values());
}

  findAll() {
    return `This action returns all bids`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bid`;
  }

  update(id: number, updateBidDto: UpdateBidDto) {
    return `This action updates a #${id} bid`;
  }

  remove(id: number) {
    return `This action removes a #${id} bid`;
  }
}
