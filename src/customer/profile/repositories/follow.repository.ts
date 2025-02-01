import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { Follow } from '../entities/followers.entity'

@Injectable()
export class FollowRepository {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}
  async create(follower: User, followed: User) {
    const follow = this.followRepository.create({
      follower,
      followed,
    })
    await this.followRepository.save(follow)
    return followed
  }

  async delete({
    follower,
    followed: unfollow,
  }: {
    follower: User
    followed: User
  }) {
    await this.followRepository.delete({ follower, followed: unfollow })
  }

  async exists({ follower, followed }: { follower: User; followed: User }) {
    return await this.followRepository.exists({
      where: {
        follower: {
          id: follower.id,
        },
        followed: {
          id: followed.id,
        },
      },
    })
  }
}
