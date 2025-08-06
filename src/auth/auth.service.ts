import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User,UserRole } from 'src/users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {


  constructor(@InjectRepository(User)
  private readonly userRepository: Repository<User>,
  private readonly jwtservice:JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
  try {
    const existingUser = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });
    
    if (existingUser) {
      throw new ConflictException(' User already exists ');
    }
    
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
    const newUser = {
      username: registerDto.username,
      password: hashedPassword,
      email: registerDto.email,
      carPlate: registerDto.carPlate,
      role: registerDto.role,
    };
    
    await this.userRepository.save(newUser);
    return ' User registered successfully ';
  } catch (error) {
    if (error instanceof ConflictException) {
      throw error;
    }
    throw new InternalServerErrorException(' Registration failed ');
  }
}







  async login(
    username: string,
    pass: string,
  ): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });
      if (!user) {
        throw new UnauthorizedException(' User not found ');
      }
      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(' Invalid password ');
      }
      const payload = {
     username: username,
     role: user.role,
   }
      const access_token= await this.jwtservice.signAsync(payload)

      return { message: ' Login successful ',access_token:access_token };
     

    }
    catch (error) {
      throw new Error(' Login failed ');
    }

  }

async changeRole(userId: number, role: string) {
  try {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (role === 'user') {
      user.role = UserRole.USER;
    } else if (role === 'admin') {
      user.role = UserRole.ADMIN;
    } else {
      throw new BadRequestException('Invalid role');
    }
    
    await this.userRepository.save(user);
    return { message: 'Role changed successfully', user };
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException('Role change failed');
  }
}






}