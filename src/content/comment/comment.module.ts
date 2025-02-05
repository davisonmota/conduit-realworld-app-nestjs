import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfileModule } from '../../customer/profile/profile.module'
import { UserModule } from '../../customer/user/user.module'
import { ArticleModule } from '../article/article.module'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { Comment } from './entities/comment.entity'
import { CommentRepository } from './repositories/comment.repository'

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
