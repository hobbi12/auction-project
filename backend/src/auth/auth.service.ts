import { Injectable, BadRequestException,Res, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';     // ← هذا السطر
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ){}
    async signUp(createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
      const existingUser=await this.usersRepository.findOne({where:{email:createUserDto.email }});
      if(existingUser){
        throw new BadRequestException('User with this email already exists');
      }
        const salt=await bcrypt.genSalt()
        const hashedPassword=await bcrypt.hash(createUserDto.password,salt);
        createUserDto.password=hashedPassword;
        const newUser=this.usersRepository.create(createUserDto);
        const savedUser=await this.usersRepository.save(newUser);
        const payload = {
        sub: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,   // لو عندك role
        };
        const access_token = this.jwtService.sign(payload);
        res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return {
          message: 'User registered successfully',
          savedUser,
          access_token,
          token_type: 'Bearer',
        };
    }
    async login(createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
      const existingUser=await this.usersRepository.findOne({where:{email:createUserDto.email }});
      if(!existingUser){
        throw new BadRequestException('Invalid credentials');
      }
      const isPasswordValid=await bcrypt.compare(createUserDto.password,existingUser.password);
      if(!isPasswordValid){
        throw new BadRequestException('password is incorrect');
      }
      const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,     // إذا عندك حقل name
      role: existingUser.role,   // أضف الـ role لاحقاً
    };
    const access_token = this.jwtService.sign(payload);
    // إعداد الكوكي
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
          message: 'Login successful',
          existingUser,
          access_token,
          token_type: 'Bearer',
        };
    }
    
    async logout(@Res({ passthrough: true }) res: Response) {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      return { message: 'Logout successful' };
    }

// src/users/users.service.ts
async getProfile(currentUser: User) {
  // ما نحتاج نبحث مرة ثانية، اليوزر موجود من التوكن
  const user = await this.usersRepository.findOne({
    where: { id: currentUser.id },
    select: ['id', 'email', 'name', 'role', 'createdAt'] // ما نرجع كلمة السر
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user;
}


  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
