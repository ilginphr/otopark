import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';



@Module({
  imports: [TypeOrmModule.forFeature([User]),JwtModule.register({      global: true,      secret: `Turuncu2020`,      signOptions: { expiresIn: '60s' },})],  // Importing User entity for TypeORM
  controllers: [AuthController],
  providers: [AuthService],
 exports:[JwtService],
})
export class AuthModule {}
