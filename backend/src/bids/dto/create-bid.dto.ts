import { IsNotEmpty, IsNumber, IsPositive, IsDate, IsUUID } from 'class-validator';
export class CreateBidDto {
    @IsNotEmpty()
    @IsNumber()
    auctionId!: number;
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()       
    amount!: number;

}
