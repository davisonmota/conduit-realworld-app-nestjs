import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

class UserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username: string

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsOptional()
  @IsUrl()
  image: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  bio: string
}

export class UpdateUserDto {
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto
}
