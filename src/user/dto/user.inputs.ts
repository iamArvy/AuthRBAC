import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateEmailInput {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'example@email.com',
    description: 'The new email for the user',
  })
  email: string;
}

export class UpdatePasswordInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'S3cur3P@ssw0rd',
    description: 'The old password for the user',
  })
  oldPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({
    example: 'N3wS3cur3P@ssw0rd',
    description: 'The new password for the user',
  })
  newPassword: string;
}

export class CreateUserInput {
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
