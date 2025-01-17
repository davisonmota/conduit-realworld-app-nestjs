import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { CurrentUserDto } from '../dto/current-user.dto'

export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserDto => {
    const request = ctx.switchToHttp().getRequest()
    const user = request['user']
    return new CurrentUserDto({
      id: user.id,
      username: user.username,
    })
  },
)
