import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // تأكد من إضافة الكيانات هنا إذا كنت تستخدم TypeORM
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule], // تأكد من تصدير TypeOrmModule إذا كنت تريد استخدامه في أماكن أخرى
})
export class UserModule {}
