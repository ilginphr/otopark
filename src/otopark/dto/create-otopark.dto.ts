import { ApiProperty } from "@nestjs/swagger";

export class CreateOtoparkDto {

  @ApiProperty({
    description: 'The name of the parking lot',
  })
  name: string;

  @ApiProperty({
    description: 'The location of the parking lot',

  })
  location: string;

  @ApiProperty({
    description: 'The total capacity of the parking lot',
    example: 100
  })
  capacity: number;

  @ApiProperty({
    description: 'The number of available spaces in the parking lot',
    example: 50
  })
  availableSpaces: number;


}
