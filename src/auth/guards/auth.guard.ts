import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { CurrentUserDto } from '../../common/dto/current-user.dto'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      // TODO: move secret to env file
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'secret',
      })
      // { sub: user.id, email: user.email, username: user.username }
      request['user'] = new CurrentUserDto({
        id: payload.sub,
        username: payload.username,
        email: payload.email,
      })
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization.split(' ') ?? []
    return type === 'Token' ? token : undefined
  }
}
