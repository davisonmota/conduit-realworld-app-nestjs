import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { Follow } from './entities/followers.entity'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { FollowRepository } from './repositories/follow.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Follow]), UserModule],
  controllers: [ProfileController],
  providers: [ProfileService, FollowRepository],
  exports: [ProfileService],
})
export class ProfileModule {}
