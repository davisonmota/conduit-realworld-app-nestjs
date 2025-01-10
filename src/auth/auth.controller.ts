import { Body, Controller, Post, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/sign-in.dto'

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  sigIn(@Body(new ValidationPipe()) { user }: SignInDto) {
    return this.authService.sigIn({
      email: user.email,
      password: user.password,
    })
  }
}
