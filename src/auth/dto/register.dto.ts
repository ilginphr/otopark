import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "src/users/entities/user.entity";

export class RegisterDto {
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
    description: 'User role',
    enum: UserRole,           
    enumName: 'UserRole',    
    example: 'user',         
    default: 'user',          
    required: false
  })
    role:UserRole = UserRole.USER; // default role is 'user'

}
