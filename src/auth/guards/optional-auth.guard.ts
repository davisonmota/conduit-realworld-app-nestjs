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
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      request['user'] = new CurrentUserDto({
        id: null,
        username: null,
      })
      return true
    }

    try {
      // TODO: move secret to env file
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'secret',
      })
      request['user'] = new CurrentUserDto({
        id: payload.sub,
        username: payload.username,
      })
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Token' ? token : undefined
  }
}
