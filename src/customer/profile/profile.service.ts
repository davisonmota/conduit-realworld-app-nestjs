import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '../user/entities/user.entity'
import { UserRepository } from '../user/repositories/user.repository'
import { ProfileResponseDto } from './dto/profile.response.dto'
import { FollowRepository } from './repositories/follow.repository'

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
  ) {}

  async getProfile(currentUsername: string | null, username: string) {
    const user = await this.userRepository.findOneByUserName(username)
    this.findUserOrThrow(user)
    if (!currentUsername || currentUsername === username) {
      return this.mapProfile(user, false)
    }
    const { isFollowing } = await this.isFollowing(currentUsername, username)
    return this.mapProfile(user, isFollowing)
  }

  async follow(followerUsername: string, followedUsername: string) {
    if (followerUsername === followedUsername) {
      throw new BadRequestException("You can't follow yourself.")
    }
    const { isFollowing, follower, followed } = await this.isFollowing(
      followerUsername,
      followedUsername,
    )
    if (isFollowing) {
      throw new BadRequestException('You are already following this profile.')
    }
    const user = await this.followRepository.create(follower, followed)
    return this.mapProfile(user, true)
  }

  async unfollow(followerUsername: string, unfollowUsername: string) {
    if (followerUsername === unfollowUsername) {
      throw new BadRequestException("You can't unfollow yourself.")
    }
    const {
      isFollowing,
      follower,
      followed: unfollow,
    } = await this.isFollowing(followerUsername, unfollowUsername)
    if (!isFollowing) {
      throw new BadRequestException("You don't follow this profile.")
    }
    await this.followRepository.delete({ follower, followed: unfollow })
    return this.mapProfile(unfollow)
  }

  async isFollowing(followerUsername: string, followedUsername: string) {
    const [follower, followed] = await this.findUsersOrThrow(
      followerUsername,
      followedUsername,
    )
    const isFollowing = await this.followRepository.exists({
      follower,
      followed,
    })
    return { isFollowing, follower, followed }
  }

  private findUserOrThrow(user: User) {
    if (!user) {
      throw new BadRequestException('User not found')
    }
  }

  private async findUsersOrThrow(
    followerUsername: string,
    followedUsername: string,
  ) {
    const [follower, followed] = await Promise.all([
      this.userRepository.findOneByUserName(followerUsername),
      this.userRepository.findOneByUserName(followedUsername),
    ])
    if (!follower || !followed) {
      throw new BadRequestException('User not found')
    }
    return [follower, followed]
  }

  private mapProfile(
    user: User,
    following: boolean = false,
  ): ProfileResponseDto {
    return {
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following,
      },
    }
  }
}
