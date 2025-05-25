import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterInput {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email for the user',
  })
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({
    example: 'S3cureP@ssw0rd',
    description: 'The password for the user',
  })
  password: string;
}

export class LoginInput {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email for the user',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'S3cureP@ssw0rd',
    description: 'The password for the user',
  })
  password: string;
}

// export class UpdateEmailInput {
//   @IsEmail()
//   @IsNotEmpty()
//   email: string;
// }

// export class UpdatePasswordInput {
//   @IsNotEmpty()
//   @IsString()
//   oldPassword: string;

//   @IsNotEmpty()
//   @IsStrongPassword()
//   newPassword: string;
// }
