import { Type } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

class SignIn {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}

export class SignInDto {
  @ValidateNested()
  @Type(() => SignIn)
  user: SignIn
}
