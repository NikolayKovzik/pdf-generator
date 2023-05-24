import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: '1234' })
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ example: 'nikolay@gmail.com' })
  @IsEmail()
  email: string;
}
