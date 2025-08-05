import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

 async create(createUserDto: CreateUserDto) { 
  const existingUser = await this.userRepository.findOne({
    where: { username: createUserDto.username }
  });

  if (existingUser) {
    throw new Error('Kullanıcı zaten kayıtlı');
  }
  const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);

  const newUser = {
    ...createUserDto,
    password: hashedPassword,
    role: createUserDto.role || UserRole.USER,
  };

  const savedUser = await this.userRepository.save(newUser);
  
  return { message: 'Kullanıcı oluşturuldu', user: savedUser };
}

  async findAll() {
    const users = await this.userRepository.find({
    
    });

    return {
      message: 'Kullanıcılar listelendi',
      users,
      total: users.length
    };
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user= await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    } 
    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }   
    if (updateUserDto.email) {
      updateUserDto.email = updateUserDto.email.toLowerCase();
    }
    if (updateUserDto.username) {
      updateUserDto.username = updateUserDto.username.toLowerCase();
    } 
    if (updateUserDto.carPlate) {
      updateUserDto.carPlate = updateUserDto.carPlate.toUpperCase();
    }   

    await this.userRepository.update(id, updateUserDto);
    return {
      message: 'Kullanıcı güncellendi',
      user: await this.userRepository.findOne({ where: { id } }),
    };
  }

 async remove(id: number) {
  const user = await this.userRepository.findOne({ where: { id } });
  await this.userRepository.delete(id);

  return { 
    message: 'Kullanıcı başarıyla silindi', 
  };
}
}
