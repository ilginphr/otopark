import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
   try {
     const existingUser = await this.userRepository.findOne({
       where: { username: createUserDto.username }
     });
     if (existingUser) {
       throw new ConflictException("User with this username already exists");
     }
     const hashedPassword = bcrypt.hashSync(createUserDto.password, 10); //14
     const newUser = {
       ...createUserDto,
       password: hashedPassword,
       role: createUserDto.role || UserRole.USER,
     };

     const savedUser = await this.userRepository.save(newUser);

     return { message: 'User has been created.', user: savedUser };
   } catch (error) {
     throw error;
   }
 }

 async findAll() {
   try {
     const users = await this.userRepository.find({});

     return {
       message: 'Users listed successfully',
       users,
       total: users.length
     };
   } catch (error) {
     throw error;
   }
 }
  //swaggerda olmadı
  async findOne(id: number) {
  try {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    if (!user) {
      throw new NotFoundException('User cannot be found.'); 
    }
    return user;
  } catch (error) {
    throw error;
  }
}


  async update(id: number, updateUserDto: UpdateUserDto) {
  try {
    const user= await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User cannot be found.'); 
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
      message: 'User updated succesfully',
      user: await this.userRepository.findOne({ where: { id } }),
    };
  } catch (error) {
    throw error;
  }
}


 async remove(id: number) {
  try {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User cannot be found.'); 
    }
    await this.userRepository.delete(id);
    return {
      message: 'User deleted succesfully',
    };
  } catch (error) {
    throw error;
  }
}
}
