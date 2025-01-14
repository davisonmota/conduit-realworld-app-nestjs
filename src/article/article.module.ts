import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { ArticleRepository } from './repositories/article.repository'
import { Article } from './entities/article.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from './entities/tag.entity'
import { UserModule } from '../user/user.module'
import { ProfileModule } from '../profile/profile.module'
import { User } from '../user/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Tag, User]),
    UserModule,
    ProfileModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository],
})
export class ArticleModule {}
