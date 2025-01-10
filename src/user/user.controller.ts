import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
  Put,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'
import { AuthGuard } from '../auth/guards/auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { GetCurrentUser } from '../common/decorators/current-user.param.decorator'
import { CurrentUserDto } from '../common/dto/current-user.dto'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @UseGuards(AuthGuard)
  @Get('user')
  getCurrentUser(@GetCurrentUser() currentUserDto: CurrentUserDto) {
    return this.userService.findOneById(currentUserDto.id)
  }

  @UseGuards(AuthGuard)
  @Put('user')
  updateUser(
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Body(new ValidationPipe({ whitelist: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateById(currentUserDto.id, updateUserDto)
  }
}
