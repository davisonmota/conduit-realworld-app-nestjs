import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { UserRepository } from '../user/repositories/user.repository'

interface SignInInput {
  email: string
  password: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async sigIn({ email, password }: SignInInput) {
    const user = await this.userService.findOneByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.')
    }

    const isMatch = await compare(password, user.password)
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.')
    }

    const payload = { sub: user.id, username: user.username }
    return {
      user: {
        token: await this.jwtService.signAsync(payload),
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
      },
    }
  }
}
