import { Module } from '@nestjs/common'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { UserModule } from '../../user/user.module'
import { ProfileModule } from '../../profile/profile.module'
import { ArticleModule } from '../article/article.module'
import { CommentRepository } from './repositories/comment.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Comment } from './entities/comment.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    UserModule,
    ProfileModule,
    ArticleModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
