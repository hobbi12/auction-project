// src/bids/entities/bid.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Auction } from 'src/auctions/entities/auction.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('bids')
export class Bid {

  @PrimaryGeneratedColumn()
  id!: number;

    @ManyToOne(() => Auction, auction => auction.bids, { onDelete: 'CASCADE' })
    auction?: Auction;
    

  @ManyToOne(() => User)
  bidder!: User;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @CreateDateColumn()           // ←←← أضف هذا
  createdAt!: Date;
}