import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAuctionDto {
  @IsNotEmpty()
  @IsNumber() // الحماية الصحيحة للرقم الإيجابي
  productId!: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startsAt!: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endsAt!: Date;
}