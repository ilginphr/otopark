import { ApiProperty } from '@nestjs/swagger';

export class ChangeRoleDto {
  @ApiProperty({
    description: 'Select user role',
    enum: ['user', 'admin'],
    example: 'user'
  })
  role: string;
}