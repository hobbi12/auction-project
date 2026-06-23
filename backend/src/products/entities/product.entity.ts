// src/products/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('products')
export class Product {

  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ length: 255,nullable:false})
  title!: string;
  @Column({ unique: true,nullable:true })
  slug!: string;
  @Column('text', { nullable: true })
  description!: string;
  @Column({ nullable: true })
  imageUrl!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  startingPrice!: number;

  @Column()
  category!: string;                    // بسيط حالياً (سهل التعديل لاحقاً)

  @ManyToOne(() => User, (user) => user.id, { eager: false })
  owner!: User;

  @Column({ default: true })
  isActive!: boolean;
    
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}