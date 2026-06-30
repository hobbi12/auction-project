// src/auctions/entities/auction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Bid } from 'src/bids/entities/bid.entity';

@Entity('auctions')
export class Auction {

  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product!: Product;

  @ManyToOne(() => User)
  seller!: User;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  startingPrice!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  currentPrice!: number;

  @Column({ type: 'timestamp' })
  startsAt!: Date;

  @Column({ type: 'timestamp' })
  endsAt!: Date;

  @Column({ default: 'pending' })
  status!: 'pending' | 'active' | 'finished' | 'cancelled';

  @CreateDateColumn()
  createdAt!: Date;

  @Column ({nullable:true})
  winnerId?:number

  @ManyToOne(()=>User,{nullable:true})
  winner?:User

  @OneToMany(() => Bid, bid => bid.auction)
  bids?: Bid[];

  @UpdateDateColumn()
  updatedAt!: Date;
}