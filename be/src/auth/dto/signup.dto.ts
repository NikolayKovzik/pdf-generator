import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'nikolay@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'nikolay' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'kovzik' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @MinLength(4)
  password: string;
}
