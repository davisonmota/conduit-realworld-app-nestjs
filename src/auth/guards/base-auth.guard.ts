import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { CurrentUserDto } from '../../common/dto/current-user.dto'

@Injectable()
export abstract class BaseAuthGuard {
  protected constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
  ) {}

  protected async verifyAndAttachUser(request: Request, token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET_JWT'),
      })
      request['user'] = new CurrentUserDto({
        id: payload.sub,
        username: payload.username,
      })
      return true
    } catch {
      return false
    }
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Token' ? token : undefined
  }
}
