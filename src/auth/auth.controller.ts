import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRole } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
    
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
   return this.authService.login(loginDto.username, loginDto.password);
}
@Patch('change-role/:id')  
async changeRole(
  @Param('id') userId: number, 
  @Body() dto: ChangeRoleDto
) {
  return this.authService.changeRole(userId, dto.role);
}

}
