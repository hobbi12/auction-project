import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuctionsModule } from './auctions/auctions.module';
import { ProductsModule } from './products/products.module';
import { BidsModule } from './bids/bids.module';
import { CategoriesModule } from './categories/categories.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: true,        // فقط أثناء التطوير
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
}),
    UserModule,
    AuthModule,
    AuctionsModule,
    ProductsModule,
    BidsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
