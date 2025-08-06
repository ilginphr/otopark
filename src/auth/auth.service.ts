import { Injectable } from '@nestjs/common';
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
    const existingUser = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });
    if (existingUser) {
      throw new Error('kullanıcı zaten kayıtlı');
    }
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10); // 10 rounds of hashing
    const newUser = {
      username: registerDto.username,
      password: hashedPassword, 
      email: registerDto.email,
      carPlate: registerDto.carPlate,
      role: registerDto.role,
      
    };
    await this.userRepository.save(newUser);

    return 'kayıt oluştu';
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
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }
      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (!isPasswordValid) {
        throw new Error('şifre yanlış');
      }
      const payload = {
     username: username,
     role: user.role,
   }
      const access_token= await this.jwtservice.signAsync(payload)

      return { message: 'giriş başarılı',access_token:access_token };
     

    }
    catch (error) {
      throw new Error('giriş başarısız');
    }

  }

async changeRole(userId: number, role: string) {  
  const user = await this.userRepository.findOne({ where: { id: userId } });
  
  if (!user) {
    throw ('User not found');
  }
  if (role === 'user') {
    user.role = UserRole.USER;
  } else if (role === 'admin') {
    user.role = UserRole.ADMIN;
  } else {
    throw ('Invalid role');
  }
  
  await this.userRepository.save(user);
  return { message: 'Role changed', user };
}







}

//   async changeRole(userId: number, role:string) {
//   const user = await this.userRepository.findOne({ 
//     where: { id: userId } 
//   });
  
//   if (!user) {
//     throw ('Kullanıcı bulunamadı');
//   }

//   const oldRole = user.role;
//   user.role =
//   await this.userRepository.save(user);
  
//   return { 
//     message: 'Rol değişti',
//     userId: user.id,
//     username: user.username,
//     oldRole: oldRole,
//     newRole: user.role
//   };
// }