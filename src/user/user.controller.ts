import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  ValidationPipe,
  Put,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'
import { AuthGuard } from '../auth/auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @UseGuards(AuthGuard)
  @Get('user')
  getCurrentUser(@Request() request: any) {
    return this.userService.findOneById(request.user.sub)
  }

  @UseGuards(AuthGuard)
  @Put('user')
  updateUser(
    @Request() request,
    @Body(new ValidationPipe({ whitelist: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateById(request.user.sub, updateUserDto)
  }
}
