import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { IsSlug } from '../../../common/validators/is-slug.constraint'

class UserDto {
  @IsNotEmpty()
  @IsString()
  @IsSlug()
  username: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}

export class CreateUserDto {
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto
}
