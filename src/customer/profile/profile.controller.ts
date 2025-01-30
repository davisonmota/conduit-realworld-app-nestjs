import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
  Delete,
} from '@nestjs/common'
import { UsernameDto } from './dto/username.dto'
import { ProfileService } from './profile.service'
import { AuthGuard } from '../../auth/guards/auth.guard'
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard'
import { GetCurrentUser } from '../../common/decorators/current-user.param.decorator'
import { CurrentUserDto } from '../../common/dto/current-user.dto'

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(OptionalAuthGuard)
  @Get(':username')
  getProfile(
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Param(new ValidationPipe()) { username }: UsernameDto,
  ) {
    return this.profileService.getProfile(currentUserDto.username, username)
  }

  @UseGuards(AuthGuard)
  @Post(':username/follow')
  followUser(
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Param(new ValidationPipe()) { username }: UsernameDto,
  ) {
    return this.profileService.follow(currentUserDto.username, username)
  }

  @UseGuards(AuthGuard)
  @Delete(':username/follow')
  unfollowUser(
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Param(new ValidationPipe()) { username }: UsernameDto,
  ) {
    return this.profileService.unfollow(currentUserDto.username, username)
  }
}
