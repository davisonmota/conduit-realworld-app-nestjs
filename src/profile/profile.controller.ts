import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
  Request,
  Delete,
} from '@nestjs/common'
import { UsernameDto } from './dto/username.dto'
import { ProfileService } from './profile.service'
import { AuthGuard } from '../auth/guards/auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(OptionalAuthGuard)
  @Get(':username')
  getProfile(
    @Request() req,
    @Param(new ValidationPipe()) { username }: UsernameDto,
  ) {
    const loggedUserUsername = req.user !== undefined ? req.user.username : null
    return this.profileService.getProfile(loggedUserUsername, username)
  }

  @UseGuards(AuthGuard)
  @Post(':username/follow')
  followUser(
    @Request() req,
    @Param(new ValidationPipe()) { username }: UsernameDto,
  ) {
    return this.profileService.follow(req.user.username, username)
  }

  @UseGuards(AuthGuard)
  @Delete(':username/follow')
  unfollowUser(
    @Request() req,
    @Param(new ValidationPipe()) { username }: UsernameDto,
  ) {
    return this.profileService.unfollow(req.user.username, username)
  }
}
