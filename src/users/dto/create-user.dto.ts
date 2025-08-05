import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';



export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
  })
  username: string;
  @ApiProperty({
    description: 'The password of the user',
  })
  password: string;
  @ApiProperty({
    description: 'The email of the user',
  })
  email: string;
  @ApiProperty({
    description: 'The car plate of the user',
  })
  carPlate: string;
  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;   }
